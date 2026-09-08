import { useIonViewWillEnter } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface PageTitleProps {
  className?: string;
  children: ReactNode;
}

// Ionic keeps a page's DOM alive when you navigate away from it inside
// the same IonRouterOutlet (just toggling display:none via
// ion-page-hidden) instead of unmounting it, so a plain CSS
// mount-triggered @keyframes animation (see global.css's `ion-content
// h1` rule) only ever plays once, on the very first visit — going back
// to an already-visited page doesn't remount the <h1>, so it doesn't
// replay. Whether display:none->visible alone restarts a CSS animation
// is also inconsistent across browsers. Bumping `key` forces React to
// genuinely unmount+remount the <h1> so the animation reliably replays
// regardless of any of that.
//
// Debounced rather than bumped straight from ionViewWillEnter: bouncing
// back to this page and away again fast enough (rapid taps between this
// page and a pushed detail page) fires that callback repeatedly, each one
// tearing down the still-animating <h1> and starting a fresh one — and
// under fast enough repetition, the very last one has been observed to
// get left animating from a browser-paused/interrupted state that never
// resumes, i.e. the title stuck invisible instead of settling at opacity
// 1. Waiting for entrance signals to stop arriving for a beat before
// actually bumping the key means only the *settled* entrance ever
// triggers a real remount.
export default function PageTitle({ className, children }: PageTitleProps) {
  const [enterKey, setEnterKey] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useIonViewWillEnter(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      setEnterKey((k) => k + 1);
    }, 400);
  });

  // Belt-and-suspenders for the animation itself: rapid remounts have
  // been observed to occasionally leave the new <h1>'s entrance animation
  // (global.css's `ion-content h1`, 850ms) paused/interrupted partway
  // through and never resuming on its own — the DOM is otherwise fine,
  // but the title stays visually stuck at whatever opacity it was
  // interrupted at instead of settling on fully visible. Rather than
  // chase down *why* a given browser's animation timeline stalls there,
  // just guarantee the end state directly a beat after the animation
  // should have finished, regardless of what actually happened to it.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const el = headingRef.current;
      if (!el) return;
      // A still-running (even if stalled) CSS animation keeps winning the
      // cascade over these two inline properties for as long as it's
      // applied, no matter what they're set to — has to actually go first.
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 950);
    return () => window.clearTimeout(timeout);
  }, [enterKey]);

  return (
    <h1 key={enterKey} ref={headingRef} className={className}>
      {children}
    </h1>
  );
}
