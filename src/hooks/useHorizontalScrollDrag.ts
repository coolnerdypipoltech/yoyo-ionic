import { useEffect } from 'react';
import type { RefObject } from 'react';

// Touch users can already pan a horizontally-overflowing container with a
// finger; a mouse can't do either of the equivalent gestures natively —
// vertical wheel scroll doesn't move it, and click-drag doesn't pan it.
// This adds both, desktop-only (see `enabled`, gated by useViewport's
// isMobile at the call site) so it never fights real touch scrolling.
export function useHorizontalScrollDrag(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    let isDragging = false;
    let moved = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      moved = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 3) moved = true;
      el.scrollLeft = startScrollLeft - delta;
    };

    const stopDragging = () => {
      isDragging = false;
    };

    // A drag that actually moved the scroll position shouldn't also fire
    // the click it ends on (e.g. a carousel card navigating away) — a
    // real touch-scroll doesn't trigger one either. Capture phase so
    // this runs before the target's own click handler.
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, [ref, enabled]);
}
