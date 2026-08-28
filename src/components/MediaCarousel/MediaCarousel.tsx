import { IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import type { UIEvent } from 'react';
import './MediaCarousel.css';

interface MediaItem {
  absolute_url: string;
  type?: string | null;
}

interface MediaCarouselProps {
  items: MediaItem[];
}

function isVideo(item: MediaItem): boolean {
  if (item.type?.toLowerCase().includes('video')) return true;
  return /\.(mp4|mov|webm|m4v)$/i.test(item.absolute_url);
}

export default function MediaCarousel({ items }: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  if (items.length === 0) {
    return <div className="media-carousel media-carousel--empty" />;
  }

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setActiveIndex(Math.min(index, items.length - 1));
    });
  };

  const goToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="media-carousel">
      <div className="media-carousel__scroller yoyo-scroll-x" ref={scrollRef} onScroll={handleScroll}>
        {items.map((item, index) => (
          <div className="media-carousel__slide" key={`${item.absolute_url}-${index}`}>
            {isVideo(item) ? (
              <video src={item.absolute_url} controls playsInline />
            ) : (
              <img src={item.absolute_url} alt="" />
            )}
          </div>
        ))}
      </div>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            className="media-carousel__nav media-carousel__nav--prev"
            onClick={() => goToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous image"
          >
            <IonIcon icon={chevronBackOutline} />
          </button>
          <button
            type="button"
            className="media-carousel__nav media-carousel__nav--next"
            onClick={() => goToIndex(activeIndex + 1)}
            disabled={activeIndex === items.length - 1}
            aria-label="Next image"
          >
            <IonIcon icon={chevronForwardOutline} />
          </button>

          <div className="media-carousel__dots">
            {items.map((item, index) => (
              <span
                key={`dot-${item.absolute_url}-${index}`}
                className={`media-carousel__dot${index === activeIndex ? ' media-carousel__dot--active' : ''}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
