import { useState, useSyncExternalStore } from 'react';
import type { LearningLanguage } from '../../../domain/types';
import { usePreferences } from '../../../app/preferences-context';
import type { LevelsState } from './model';
import { localLevelsStorage } from './storage';
import { subscribeData } from '../../../account/storage';
import { recordLearningActivity } from '../../../admin/activity';

function createLevelsStore(fallback: LearningLanguage) {
  let snapshot = localLevelsStorage.read(fallback);
  const listeners = new Set<() => void>();
  function publish(next: typeof snapshot) { snapshot = next; listeners.forEach(listener => listener()); }
  function refresh() {
    const next = localLevelsStorage.read(fallback);
    // Keep unsaved in-tab changes if browser storage is temporarily unavailable.
    publish(next.warning === 'unavailable' ? { ...snapshot, warning: next.warning } : next);
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener); const unsubscribe = subscribeData(refresh);
      // Re-read after subscribing so a write made during mounting cannot be missed.
      refresh();
      return () => { listeners.delete(listener); unsubscribe(); };
    },
    update(change: (state: LevelsState) => LevelsState) {
      const state = change(snapshot.state);
      if (state === snapshot.state) return;
      const before = snapshot.state;
      const saved = localLevelsStorage.write(state);
      recordLearningActivity(before, state);
      publish({ state, warning: saved ? null : 'unavailable' });
    },
  };
}

export function useLevelsStore() {
  const { preferences } = usePreferences();
  const [controller] = useState(() => createLevelsStore(preferences.learningLanguage));
  const stored = useSyncExternalStore(controller.subscribe, controller.getSnapshot);
  return { state: stored.state, warning: stored.warning, update: controller.update };
}
export type LevelsStore = ReturnType<typeof useLevelsStore>;
