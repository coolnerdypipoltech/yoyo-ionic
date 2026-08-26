import { useEffect, useState } from 'react';
import * as advertisementsService from '../../api/services/advertisements.service';
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

  const handleClick = (ad: AdResult) => {
    if (ad.url) window.open(ad.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="ad-banner yoyo-scroll-x" style={{ justifyContent: ads.length === 1 ? 'center' : 'flex-start' }}>
      {ads.map((ad) => (
        <button type="button" key={ad.id} className="ad-banner__slide" onClick={() => handleClick(ad)}>
          <img src={ad.main.absolute_url} alt="" />
        </button>
      ))}
    </div>
  );
}
