import type { LearningLanguage } from '../../../domain/types';
import { newAssessment } from './assessment';
import type { LevelsState } from './model';

// The account adapter can supply a real identity when authentication is introduced.
// Until then retakes remain available and no registration is simulated.
export function assessmentAccess(hasCompletedTest: boolean, identity: { id: string } | null, requireAccountForRetake = false) {
  return !hasCompletedTest || !requireAccountForRetake || identity !== null;
}
export function startPlacement(state: LevelsState, language: LearningLanguage): LevelsState {
  const previous = state.runs[language];
  const history = previous?.completed && !state.assessmentHistory.some(run => run.id === previous.id)
    ? [...state.assessmentHistory, previous] : state.assessmentHistory;
  return { ...state, assessmentHistory: history, placementChoice: { ...state.placementChoice, [language]: 'test' },
    runs: { ...state.runs, [language]: newAssessment(language, false) } };
}
