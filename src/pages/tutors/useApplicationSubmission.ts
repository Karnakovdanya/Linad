import { useEffect, useRef, useState } from 'react';
import type { Application, SubmissionIssue, SubmissionReceipt } from './model';
import { ApplicationSubmissionError, submitTutorApplication } from './web3forms';

export function useApplicationSubmission(onSubmitted: (receipt: SubmissionReceipt) => void) {
  const [issue, setIssue] = useState<SubmissionIssue | null>(null);
  const [sending, setSending] = useState(false);
  const locked = useRef(false); const alive = useRef(true); const request = useRef<AbortController | null>(null);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; request.current?.abort(); };
  }, []);
  async function send(application: Application, botcheck: boolean) {
    if (locked.current) return;
    locked.current = true; setSending(true); setIssue(null);
    const controller = new AbortController(); request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      await submitTutorApplication(application, botcheck, { signal: controller.signal });
      if (alive.current) onSubmitted({ kind: application.kind, tutorId: application.kind === 'lesson' ? application.tutorId : undefined, submittedAt: Date.now() });
    } catch (error) { if (alive.current) setIssue(error instanceof ApplicationSubmissionError ? error.issue : 'provider-error'); }
    finally { clearTimeout(timeout); locked.current = false; if (alive.current) setSending(false); }
  }
  return { issue, sending, send };
}
