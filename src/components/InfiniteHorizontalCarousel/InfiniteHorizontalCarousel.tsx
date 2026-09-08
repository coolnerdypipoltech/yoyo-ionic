import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { IonSpinner } from '@ionic/react';
import { useViewport } from '../../context/ViewportContext';
import { useHorizontalScrollDrag } from '../../hooks/useHorizontalScrollDrag';
import horizontalControl from '../../assets/icons/horizontal-control.svg';
import './InfiniteHorizontalCarousel.css';

interface InfiniteHorizontalCarouselProps<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  emptyText: string;
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
}

// Once every real page is loaded (hasMore is false), the list is
// rendered this many times back to back instead of once, so there's
// always more of the same sequence ahead/behind to scroll into — see the
// loop-reset logic in updateScrollState for how reaching either end
// loops back around without a visible jump.
const LOOP_COPIES = 3;

export default function InfiniteHorizontalCarousel<T>({
  items,
  isLoading,
  hasMore,
  onLoadMore,
  emptyText,
  getKey,
  renderItem,
}: InfiniteHorizontalCarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewport();
  const hasCenteredLoopRef = useRef(false);
  // True for the duration of a nav-button's own `scrollBy({behavior:
  // 'smooth'})` glide — see updateScrollState below for why.
  const isButtonScrollRef = useRef(false);

  useHorizontalScrollDrag(scrollRef, !isMobile);

  // All real pages are in and there's more than one item to cycle
  // through — worth looping. (While hasMore is still true, more genuine
  // items are on the way via the sentinel below, so looping the
  // not-yet-complete list wouldn't make sense.)
  const isLooping = !hasMore && items.length > 1;

  // scrollWidth includes the container's own one-time horizontal padding
  // (it isn't repeated per copy), so dividing it by LOOP_COPIES directly
  // would overstate a single copy's width by paddingTotal/LOOP_COPIES.
  // Subtracting the padding first keeps each copy's width exact, which is
  // what makes every ±copyWidth reset below land on a perfect repeat of
  // the content (copy N and copy N+1 are identical, so the shift itself
  // is invisible regardless of where in the list it happens).
  const measureLoop = useCallback((el: HTMLDivElement) => {
    const style = getComputedStyle(el);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const copyWidth = (el.scrollWidth - paddingLeft - paddingRight) / LOOP_COPIES;
    return { copyWidth, paddingLeft };
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    // While a nav button's own smooth-scroll animation is still gliding,
    // the browser keeps firing 'scroll' events for every intermediate
    // frame of it — reacting to one by setting `scrollLeft` directly here
    // (a plain, unanimated jump) cancels that in-flight animation outright,
    // which is what read as an every-other-click "brake": whichever click
    // happened to cross the reset threshold mid-glide got cut short, while
    // one that didn't played out smoothly. Skipping the check for the
    // whole glide and re-running it once in handleScrollEnd below (after
    // the animation has actually settled) keeps the glide itself
    // uninterrupted no matter when the threshold gets crossed.
    if (!el || !isLooping || isButtonScrollRef.current) return;
    // Keep the scroll position anchored within the middle copy: once it
    // drifts into the first or last copy, silently jump it back by
    // exactly one copy's width (a plain property set, no animation).
    // That jump is invisible because copy N and copy N+1 render
    // identical content — the user just keeps seeing more of the same
    // sequence instead of a snap back to the start.
    const { copyWidth } = measureLoop(el);
    if (el.scrollLeft < copyWidth * 0.5) {
      el.scrollLeft += copyWidth;
    } else if (el.scrollLeft > copyWidth * 1.5) {
      el.scrollLeft -= copyWidth;
    }
  }, [isLooping, measureLoop]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (isLooping && !hasCenteredLoopRef.current) {
      // The first time this list starts looping, start the visible
      // scroll position at the beginning of the middle copy — that's
      // what leaves the first copy available to scroll backward into,
      // instead of starting right at the very edge with nowhere to go.
      // A plain copyWidth jump lands exactly `paddingLeft` short of that
      // copy's first item, because the leading gap this list starts with
      // (the spacer below, plus the container's own left padding) is
      // wider than the plain gap between every other pair of items — so
      // without this extra nudge, `paddingLeft` worth of the *previous*
      // copy's last item is still left poking in at the edge.
      const { copyWidth, paddingLeft } = measureLoop(el);
      el.scrollLeft = copyWidth + paddingLeft;
      hasCenteredLoopRef.current = true;
    }

    updateScrollState();
    // Also recompute on resize — content changes (items.length) don't
    // change the container's own box size, so they wouldn't otherwise
    // be caught by this.
    const observer = new ResizeObserver(() => updateScrollState());
    observer.observe(el);

    // Fires once a nav-button glide (or any other scroll) has fully come
    // to rest — this is what actually applies the loop-reset that
    // updateScrollState skipped while isButtonScrollRef was set, now that
    // there's no in-flight animation left for it to collide with.
    const handleScrollEnd = () => {
      isButtonScrollRef.current = false;
      updateScrollState();
    };
    el.addEventListener('scrollend', handleScrollEnd);

    return () => {
      observer.disconnect();
      el.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [items.length, isLooping, updateScrollState, measureLoop]);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current || !scrollRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { root: scrollRef.current, threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, items.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    isButtonScrollRef.current = true;
    // Safety net for browsers without 'scrollend' (e.g. pre-17.4 Safari,
    // relevant to the gh-pages web build) — without it, a click there
    // would leave the loop-reset permanently suppressed.
    window.setTimeout(() => {
      isButtonScrollRef.current = false;
      updateScrollState();
    }, 600);
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="horizontal-carousel horizontal-carousel--centered">
        <IonSpinner name="dots" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="horizontal-carousel horizontal-carousel--centered">
        <p className="horizontal-carousel__empty">{emptyText}</p>
      </div>
    );
  }

  const copies = isLooping ? LOOP_COPIES : 1;

  return (
    <div className="horizontal-carousel-wrapper">
      <div className="horizontal-carousel yoyo-scroll-x" ref={scrollRef} onScroll={updateScrollState}>
        <div className="horizontal-carousel__spacer"></div>

        {Array.from({ length: copies }, (_, copy) =>
          items.map((item) => (
            <div key={`${getKey(item)}::${copy}`} className="horizontal-carousel__item">
              {renderItem(item)}
            </div>
          )),
        )}
        {hasMore ? <div className="horizontal-carousel__sentinel" ref={sentinelRef} /> : null}
      </div>

      {!isMobile ? (
        <>
          <button
            type="button"
            className="horizontal-carousel__nav horizontal-carousel__nav--prev"
            onClick={() => scrollByPage(-1)}
            disabled={items.length <= 1}
            aria-label="Previous"
          >
            <img src={horizontalControl} alt="" />
          </button>
          <button
            type="button"
            className="horizontal-carousel__nav horizontal-carousel__nav--next"
            onClick={() => scrollByPage(1)}
            disabled={items.length <= 1}
            aria-label="Next"
          >
            <img src={horizontalControl} alt="" />
          </button>
        </>
      ) : null}
    </div>
  );
}
