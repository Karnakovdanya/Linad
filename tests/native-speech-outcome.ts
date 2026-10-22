import { expect, type Page } from '@playwright/test';
import { messages } from '../src/i18n/messages';
import { practiceSpeechCopy } from '../src/i18n/practice-speech-messages';

// A listed OS voice can still fail when a headless/remote host has no usable
// synthesis service or audio device. Verify the real result and the UI recovery;
// never infer successful playback from getVoices() alone or replace native speak.
export async function expectNativeSpeechOutcome(page: Page, events: string[], voiceAvailable: boolean) {
  await expect(page.locator('.practice-listen[aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator('.practice-listen[aria-busy="true"]')).toHaveCount(0);
  if (!voiceAvailable) {
    expect(events).toEqual([]);
    await expect(page.locator('.practice-status').filter({ hasText: messages.ru.practiceVoiceMissing })).toBeVisible();
    return;
  }
  if (events.includes('end')) {
    expect(events).toContain('start');
    expect(events.indexOf('start')).toBeLessThan(events.lastIndexOf('end'));
    expect(events.at(-1)).toBe('end');
    await expect(page.locator('.practice-status').filter({ hasText: messages.ru.practiceSpeechError })).toHaveCount(0);
    return;
  }
  const environmentErrors = ['synthesis-failed', 'synthesis-unavailable', 'audio-hardware', 'network', 'voice-unavailable', 'language-unavailable', 'not-allowed'];
  const last = events.at(-1);
  expect(environmentErrors.map(code => `error:${code}`)).toContain(last);
  for (const event of events) expect(['start', ...environmentErrors.map(code => `error:${code}`)]).toContain(event);
  const copy = practiceSpeechCopy('ru');
  const notice = last === 'error:network' ? copy.network : last === 'error:not-allowed' ? copy.blocked : messages.ru.practiceSpeechError;
  await expect(page.locator('.practice-status').filter({ hasText: notice })).toBeVisible();
}
