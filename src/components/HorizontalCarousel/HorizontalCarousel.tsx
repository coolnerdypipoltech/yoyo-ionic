import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { IonSpinner } from '@ionic/react';
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
    <div className="horizontal-carousel yoyo-scroll-x" ref={scrollRef}>
       <div className="horizontal-carousel__spacer"></div>

      {items.map((item) => (
        <div key={getKey(item)} className="horizontal-carousel__item">
          {renderItem(item)}
        </div>
      ))}
      {hasMore ? <div className="horizontal-carousel__sentinel" ref={sentinelRef} /> : null}
    </div>
  );
}
