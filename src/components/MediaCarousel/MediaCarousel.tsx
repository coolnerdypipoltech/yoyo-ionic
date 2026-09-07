import { IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, SyntheticEvent, UIEvent } from 'react';
import placeholder from '../../assets/Placeholder.png';
import './MediaCarousel.css';

export interface MediaItem {
  absolute_url: string;
  type?: string | null;
}

interface MediaCarouselProps {
  items: MediaItem[];
  /** Extra class on the root — lets a caller (e.g. AdBanner) override
   * sizing/aspect-ratio without changing this component's own defaults. */
  className?: string;
  /** When given, a click on the active slide calls this instead of
   * advancing to the next one — e.g. AdBanner uses it to open the ad's
   * link, since "click to advance" wouldn't make sense for ads. */
  onItemClick?: (item: MediaItem, index: number) => void;
}

function isVideo(item: MediaItem): boolean {
  if (item.type?.toLowerCase().includes('video')) return true;
  return /\.(mp4|mov|webm|m4v)$/i.test(item.absolute_url);
}

function handleImageError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = placeholder;
}

export default function MediaCarousel({ items, className, onItemClick }: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  // Tracks which slides have actually finished fetching (loaded or
  // errored) so each one can show a shimmer in place of blank space
  // until then, instead of all-or-nothing for the whole carousel.
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set());

  const markLoaded = (index: number) => {
    setLoadedIndices((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
  };

  if (items.length === 0) {
    return (    <div className={`media-carousel${className ? ` ${className}` : ''}`}>
      <div
        className="media-carousel__scroller yoyo-scroll-x"
        ref={scrollRef}
      >
        <img src={placeholder} alt="" onError={handleImageError} />
      </div>


    </div>);
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

  // Wheel/drag panning fought this carousel's scroll-snap (it kept
  // reverting the scroll position) and didn't hold up in practice — a
  // click advancing to the next image, wrapping back to the first after
  // the last, is a plain, reliable way to move through it with a mouse.
  // Ignored on a video's own controls so play/pause isn't hijacked.
  // When the caller wants clicks to mean something else entirely (see
  // onItemClick above), that takes over instead of advancing.
  const handleSlideClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'VIDEO') return;
    if (onItemClick) {
      onItemClick(items[activeIndex], activeIndex);
      return;
    }
    if (items.length <= 1) return;
    goToIndex((activeIndex + 1) % items.length);
  };

  return (
    <div className={`media-carousel${className ? ` ${className}` : ''}`}>
      <div
        className="media-carousel__scroller yoyo-scroll-x"
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={handleSlideClick}
      >
        {items.map((item, index) => (
          <div
            className={`media-carousel__slide${loadedIndices.has(index) ? '' : ' yoyo-skeleton'}`}
            key={`${item.absolute_url}-${index}`}
          >
            {isVideo(item) ? (
              <video
                src={item.absolute_url}
                muted
                autoPlay
                playsInline
                loop
                preload="metadata"
                onLoadedData={() => markLoaded(index)}
                onError={() => markLoaded(index)}
              />
            ) : (
              <img
                src={item.absolute_url}
                alt=""
                onLoad={() => markLoaded(index)}
                onError={(e) => {
                  handleImageError(e);
                  markLoaded(index);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            className="media-carousel__nav media-carousel__nav--prev"
            onClick={() => goToIndex((activeIndex - 1 + items.length) % items.length)}
            aria-label="Previous image"
          >
            <IonIcon icon={chevronBackOutline} />
          </button>
          <button
            type="button"
            className="media-carousel__nav media-carousel__nav--next"
            onClick={() => goToIndex((activeIndex + 1) % items.length)}
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
