import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { IonSpinner } from '@ionic/react';
import { useViewport } from '../../context/ViewportContext';
import { useHorizontalScrollDrag } from '../../hooks/useHorizontalScrollDrag';
import horizontalControl from '../../assets/icons/horizontal-control.svg';
import './HorizontalCarousel.css';

interface HorizontalCarouselProps<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  emptyText: string;
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
}

export default function HorizontalCarousel<T>({
  items,
  isLoading,
  hasMore,
  onLoadMore,
  emptyText,
  getKey,
  renderItem,
}: HorizontalCarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewport();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useHorizontalScrollDrag(scrollRef, !isMobile);

  // Nav buttons fade out via :disabled once there's nothing left in that
  // direction to scroll to, rather than just always being enabled.
  const updateScrollBounds = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollBounds();
    // Also recompute on resize — content changes (items.length) don't
    // change the container's own box size, so they wouldn't otherwise
    // be caught by this.
    const observer = new ResizeObserver(() => updateScrollBounds());
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length, updateScrollBounds]);

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

  return (
    <div className="horizontal-carousel-wrapper">
      <div className="horizontal-carousel yoyo-scroll-x" ref={scrollRef} onScroll={updateScrollBounds}>
        <div className="horizontal-carousel-spacer"></div>
        {items.map((item) => (
          <div key={getKey(item)} className="horizontal-carousel__item">
            {renderItem(item)}
          </div>
        ))}
        {hasMore ? <div className="horizontal-carousel__sentinel" ref={sentinelRef} /> : null}
      </div>

      {!isMobile ? (
        <>
          <button
            type="button"
            className="horizontal-carousel__nav horizontal-carousel__nav--prev"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous"
          >
            <img src={horizontalControl} alt="" />
          </button>
          <button
            type="button"
            className="horizontal-carousel__nav horizontal-carousel__nav--next"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label="Next"
          >
            <img src={horizontalControl} alt="" />
          </button>
        </>
      ) : null}
    </div>
  );
}
