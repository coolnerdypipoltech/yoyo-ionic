import { useEffect, useState } from 'react';
import * as advertisementsService from '../../api/services/advertisements.service';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import type { MediaItem } from '../MediaCarousel/MediaCarousel';
import type { AdResult } from '../../api/types';
import './FeaturedCarousel.css';

export default function FeaturedCarousel() {
  const [items, setItems] = useState<AdResult[]>([]);

  useEffect(() => {
    let cancelled = false;
    advertisementsService
      .getAdvertisements()
      .then((results) => {
        if (!cancelled) setItems(results);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) return null;

  const handleItemClick = (_item: MediaItem, index: number) => {
    const item = items[index];
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="featured-carousel-container">
    <MediaCarousel
      className="featured-carousel"
      items={items.map((item) => item.main)}
      onItemClick={handleItemClick}
    /></div>
  );
}
