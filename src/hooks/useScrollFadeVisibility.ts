import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

// Drives a collapsing-header-style fade: true while idle or scrolling
// up, false while actively scrolling down — mirrors the native-app
// pattern of tucking the header away to give content more room, and
// bringing it right back the moment the user scrolls back toward it.
//
// Reads `scrollTop` straight off the real scroll element (rather than
// IonContent's `ionScroll`/`scrollEvents`) and diffs it against the
// previous reading itself: Ionic's own `detail.deltaY` is cumulative
// since the current scroll *gesture* started, not frame-to-frame, so a
// direction reversal mid-gesture (flick down then immediately back up
// without a pause) wouldn't register until the cumulative value crossed
// back through zero — laggy exactly when responsiveness matters most.
export function useScrollFadeVisibility(contentRef: RefObject<HTMLIonContentElement | null>) {
  const [visible, setVisible] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const ionContent = contentRef.current;
    if (!ionContent) return;

    let scrollEl: HTMLElement | null = null;
    let cancelled = false;

    const onScroll = () => {
      if (!scrollEl) return;
      const scrollTop = scrollEl.scrollTop;
      const delta = scrollTop - lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      // Near the top there's nothing to gain from hiding it, and small
      // rubber-band bounces there shouldn't flicker it either.
      if (scrollTop <= 10) {
        setVisible(true);
        return;
      }
      if (delta > 0) setVisible(false);
      else if (delta < 0) setVisible(true);
    };

    ionContent.getScrollElement().then((el) => {
      if (cancelled) return;
      scrollEl = el;
      lastScrollTop.current = el.scrollTop;
      el.addEventListener('scroll', onScroll, { passive: true });
    });

    return () => {
      cancelled = true;
      scrollEl?.removeEventListener('scroll', onScroll);
    };
  }, [contentRef]);

  return visible;
}
