import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import placeholder from '../../assets/Placeholder.png';
import './CarouselItemCard.css';

interface CarouselItemCardProps {
  imageUrl?: string;
  title: string;
  expired?: boolean;
  onClick: () => void;
}

export default function CarouselItemCard({ imageUrl, title, expired, onClick }: CarouselItemCardProps) {
  // No imageUrl means we show the (already-bundled) placeholder right
  // away — nothing is being fetched, so there's nothing to show a
  // skeleton for.
  const [isLoaded, setIsLoaded] = useState(!imageUrl);

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholder;
    setIsLoaded(true);
  };

  let isExpired = expired || false;

  isExpired = false;

  return (
    <button type="button" className="carousel-item-card" onClick={onClick}>
      <div className={`carousel-item-card__image${isLoaded ? '' : ' yoyo-skeleton'}`}>
        <img
          src={imageUrl || placeholder}
          alt=""
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
        />
        {false && <><div className="carousel-item-card__image-tag"><p>{isExpired ? 'Expired' : 'Active'}</p></div></>}
      </div>
      <span className="carousel-item-card__title" >{title}</span>
    </button>
  );
}
