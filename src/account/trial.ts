import type { LearningLanguage } from '../domain/types';
import type { CefrLevel } from '../pages/learning/levels/model';
import { curricula } from '../pages/learning/levels/data/curriculum';
import { emptyDocument, mergeDocuments, parseDocument, readDocument, type AccountDocument } from './document';

export const TRIAL_KEY = 'linad.trial-transfers.v1';
export const AUTH_RETURN_KEY = 'linad.auth-return.v1';
interface Scope { language: LearningLanguage; level: CefrLevel; moduleId: string }
interface Ticket { id: string; scopes: Scope[]; userId: string | null; recipient?: string; document?: AccountDocument; committed?: boolean }
function tickets(): Ticket[] { return JSON.parse(localStorage.getItem(TRIAL_KEY) ?? '[]') as Ticket[]; }
function save(value: Ticket[]) { localStorage.setItem(TRIAL_KEY, JSON.stringify(value)); }
export function firstModule(language: LearningLanguage, level: string) { return curricula[language].find(module => module.level === level); }
export function rememberTrial(scope: Scope) {
  const all = tickets(); let ticket = all.find(item => item.userId === null);
  if (!ticket) { ticket = { id: crypto.randomUUID(), scopes: [], userId: null }; all.push(ticket); }
  if (ticket.scopes.some(item => item.language === scope.language && item.level === scope.level && item.moduleId === scope.moduleId)) return;
  ticket.scopes.push(scope); save(all);
}
// Transfer only selected first-module scopes, never unrelated guest history. Originals stay intact.
export function trialDocument(guest: AccountDocument, scopes: Scope[]): AccountDocument {
  const doc = emptyDocument(); doc.updatedAt = guest.updatedAt;
  for (const scope of scopes) {
    const module = firstModule(scope.language, scope.level);
    if (!module || module.id !== scope.moduleId) continue;
    const prefix = `${scope.language}:${scope.level}:${module.id}`;
    for (const id of module.lessonIds) {
      const key = `${scope.language}:${id}`;
      if (guest.levels.lessons[key]) doc.levels.lessons[key] = guest.levels.lessons[key];
    }
    if (guest.levels.moduleAttempts[prefix]) doc.levels.moduleAttempts[prefix] = guest.levels.moduleAttempts[prefix]!;
    if (guest.levels.examRuns[prefix]) doc.levels.examRuns[prefix] = guest.levels.examRuns[prefix]!;
    doc.levels.selectedLevels[scope.language] = scope.level;
    doc.levels.setupComplete[scope.language] = true;
    const last = guest.levels.lastLesson[scope.language];
    if (last?.moduleId === module.id && last.level === scope.level) doc.levels.lastLesson[scope.language] = last;
    const activity = guest.levels.activity[scope.language];
    if (activity?.lessonId && module.lessonIds.includes(activity.lessonId) || activity?.kind === 'module-test' && guest.levels.moduleAttempts[prefix]?.some(attempt => attempt.completedAt === activity.at)) doc.levels.activity[scope.language] = activity;
  }
  doc.levels.targetLanguage = guest.levels.targetLanguage; doc.levels.supportLanguage = guest.levels.supportLanguage;
  return parseDocument(doc);
}
export function expectTrialAccount(email: string) {
  const all = tickets(); const unbound = all.filter(ticket => ticket.userId === null);
  if (!unbound.length) return;
  for (const ticket of unbound) ticket.recipient = email.trim().toLowerCase();
  save(all);
}
export function bindTrialToAccount(userId: string, email?: string) {
  const all = tickets(); const unbound = all.filter(ticket => ticket.userId === null && (!ticket.recipient || ticket.recipient === email?.trim().toLowerCase()));
  if (!unbound.length) return;
  const guest = readDocument(null);
  for (const ticket of unbound) { ticket.document = trialDocument(guest, ticket.scopes); ticket.userId = userId; delete ticket.recipient; }
  // This durable copy must succeed before changing the data owner.
  save(all);
}
export function pendingTrial(userId: string) {
  return tickets().filter(ticket => ticket.userId === userId && !ticket.committed && ticket.document).map(ticket => ({ id: ticket.id, document: parseDocument(ticket.document) }));
}
export function mergeTrial(account: AccountDocument, trial: AccountDocument) {
  const merged = mergeDocuments(account, trial);
  for (const language of ['de', 'en'] as const) merged.levels.selectedLevels[language] = trial.levels.setupComplete[language] ? trial.levels.selectedLevels[language] : account.levels.selectedLevels[language];
  merged.levels.targetLanguage = trial.levels.setupComplete[trial.levels.targetLanguage] ? trial.levels.targetLanguage : account.levels.targetLanguage;
  merged.levels.supportLanguage = trial.levels.setupComplete[trial.levels.targetLanguage] ? trial.levels.supportLanguage : account.levels.supportLanguage;
  return merged;
}
export function acknowledgeTrials(userId: string, ids: string[]) {
  if (!ids.length) return;
  const all = tickets(); for (const ticket of all) if (ticket.userId === userId && ids.includes(ticket.id)) ticket.committed = true;
  save(all); // Keep the backup; never erase guest results after authentication.
}
export function safeReturn(value: string | null) {
  return value && /^\/learn\/levels\/(?:modules|lessons)\/[A-C][12]\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(value) ? value : '/profile';
}
export function authReturn() { try { return safeReturn(localStorage.getItem(AUTH_RETURN_KEY)); } catch { return '/profile'; } }
export function rememberAuthReturn(path: string) { localStorage.setItem(AUTH_RETURN_KEY, safeReturn(path)); }
export function clearAuthReturn() { try { localStorage.removeItem(AUTH_RETURN_KEY); } catch { /* Optional navigation preference. */ } }
