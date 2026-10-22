import { useEffect, useState } from 'react';

/** Keep the fixed control clear of footer links and the currently focused form field. */
export function useLinDock() {
  const [dock, setDock] = useState({ bottom: 20, height: 800, keyboard: 0 });
  useEffect(() => {
    let frame = 0;
    function measure() {
      frame = 0;
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const keyboard = Math.max(0, window.innerHeight - height - (viewport?.offsetTop ?? 0));
      const gap = window.innerWidth <= 600 ? 16 : 20;
      let bottom = gap + keyboard;
      const footer = document.querySelector('.site-footer')?.getBoundingClientRect();
      if (footer && footer.top < window.innerHeight && footer.bottom > 0) bottom = Math.max(bottom, window.innerHeight - footer.top + 12);
      const active = document.activeElement;
      if (active instanceof HTMLElement && !active.closest('.lin-assistant') && active.matches('input, textarea, select, button, a')) {
        const rect = active.getBoundingClientRect();
        const left = window.innerWidth - gap - 64;
        if (rect.right > left && rect.left < left + 64 && rect.bottom > window.innerHeight - bottom - 64 && rect.top < window.innerHeight - bottom) bottom = window.innerHeight - rect.top + 12;
      }
      bottom = Math.max(gap, Math.min(bottom, window.innerHeight - 100));
      setDock(previous => previous.bottom === bottom && previous.height === height && previous.keyboard === keyboard ? previous : { bottom, height, keyboard });
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(measure); }
    measure();
    window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
    window.addEventListener('focusin', schedule); window.addEventListener('focusout', schedule);
    window.visualViewport?.addEventListener('resize', schedule); window.visualViewport?.addEventListener('scroll', schedule);
    const observer = new ResizeObserver(schedule); observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      window.removeEventListener('focusin', schedule); window.removeEventListener('focusout', schedule);
      window.visualViewport?.removeEventListener('resize', schedule); window.visualViewport?.removeEventListener('scroll', schedule);
    };
  }, []);
  return dock;
}
