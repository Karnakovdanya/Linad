import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

type Fingerprint = { sha256: string; lf?: string; crlf?: string };
// Fixed, reviewed release snapshot from 22 October 2026, before Pages preparation.
// Tests never regenerate it or use current content hashes as expected values.
const release: Record<string, Fingerprint> = JSON.parse(readFileSync('tests/fixtures/release-approved-sources.json', 'utf8'));
export function approvedReleaseSources(baseline: Record<string, string>) {
  return Object.fromEntries(Object.entries(baseline).map(([file, fallback]) => {
    const approved = release[file.replaceAll('\\', '/')];
    if (!approved) return [file, fallback];
    const content = approved.lf ? readFileSync(file, 'utf8') : '';
    // Git checkout may normalize EOLs. Accept only the fixed LF, CRLF, or original
    // mixed-EOL representation, never a hash derived from the current source.
    const crlf = content.includes('\r\n');
    const mixed = crlf && content.replaceAll('\r\n', '').includes('\n');
    return [file, mixed ? approved.sha256 : crlf ? approved.crlf! : approved.lf ?? approved.sha256];
  }));
}
export function assertApprovedSources(files: string[]) {
  for (const file of files) {
    const approved = release[file.replaceAll('\\', '/')];
    assert.ok(approved, 'No reviewed fingerprint: ' + file);
    const data = readFileSync(file);
    const actual = createHash('sha256').update(approved.lf ? data.toString('utf8').replaceAll('\r\n', '\n') : data).digest('hex');
    assert.equal(actual, approved.lf ?? approved.sha256, 'Unreviewed source change: ' + file);
  }
}
export function assertApprovedInventory() {
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(dir + '/' + entry.name) : [dir + '/' + entry.name]);
  const roots = ['src', 'supabase', 'public', 'shared'];
  const current = roots.flatMap(walk).sort();
  const expected = Object.keys(release).filter(file => roots.some(root => file.startsWith(root + '/'))).sort();
  assert.deepEqual(current, expected, 'Unexpected added or removed application files');
  assertApprovedSources(current);
}
// Retain historical audit coverage, but compare it with the reviewed release,
// rather than task-local snapshots that predate later authorised changes.
export const approvedMilestoneTypographySources = approvedReleaseSources;
export const approvedMilestoneBackgroundSources = approvedReleaseSources;
export const approvedProfileMilestoneSources = approvedReleaseSources;
export const approvedColorPolishSources = approvedReleaseSources;
export const approvedHomeAboutSources = approvedReleaseSources;
export const approvedLinSources = approvedReleaseSources;
export const approvedAccountSources = approvedReleaseSources;
export const approvedTelegramSources = approvedReleaseSources;
export const approvedTutorSources = approvedReleaseSources;
export const approvedPracticeSpeechSources = approvedReleaseSources;
export const currentProtectedSources = approvedReleaseSources;
