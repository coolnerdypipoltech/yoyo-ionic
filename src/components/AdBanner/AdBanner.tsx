import { useEffect, useState } from 'react';
import * as advertisementsService from '../../api/services/advertisements.service';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import type { MediaItem } from '../MediaCarousel/MediaCarousel';
import type { AdResult } from '../../api/types';
import './AdBanner.css';

export default function AdBanner() {
  const [ads, setAds] = useState<AdResult[]>([]);

  useEffect(() => {
    let cancelled = false;
    advertisementsService
      .getAdvertisements()
      .then((results) => {
        if (!cancelled) setAds(results);
      })
      .catch(() => {
        if (!cancelled) setAds([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (ads.length === 0) return null;

  const handleItemClick = (_item: MediaItem, index: number) => {
    const ad = ads[index];
    if (ad.url) window.open(ad.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="ad-banner-container">
    <MediaCarousel
      className="ad-banner"
      items={ads.map((ad) => ad.main)}
      onItemClick={handleItemClick}
    /></div>
  );
}
