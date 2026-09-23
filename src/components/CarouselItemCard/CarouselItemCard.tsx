import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import placeholder from '../../assets/Placeholder.png';
import './CarouselItemCard.css';

import sparkAvailable from '../../assets/icons/Spark.svg';
import sparkExpired from '../../assets/icons/SparkGrey.svg';
import sparkComingSoon from '../../assets/icons/SparkG.svg';
import sparkSold from '../../assets/icons/SparkW.svg';


interface CarouselItemCardProps {
  imageUrl?: string;
  title: string;
  expired?: string;
  onClick: () => void;
  stock?: number;
  starts?: string;
}

export default function CarouselItemCard({ imageUrl, title, expired, onClick, stock, starts }: CarouselItemCardProps) {
  // No imageUrl means we show the (already-bundled) placeholder right
  // away — nothing is being fetched, so there's nothing to show a
  // skeleton for.
  const [isLoaded, setIsLoaded] = useState(!imageUrl);

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholder;
    setIsLoaded(true);
  };

  let isExpired = true;
  let isStocked = true;
  let hasStarted = true;

  if(stock !== undefined) {
    
    if(stock == 0) {
      isStocked = false;
    }else{
      isStocked = true;
    }
  }


  if(starts){
      if(new Date().getTime() < (starts ? new Date(starts).getTime() : 0)) {
      hasStarted = false;
    } else {
      hasStarted = true;
    }
  }


  if(expired){
    
      if(new Date().getTime() > (expired ? new Date(expired).getTime() : 0)) {
      isExpired = false;
    } else {
      isExpired = true;
      
    }
  }

  if(!isStocked && !isExpired){
    isStocked = true;
  }

  if(!isStocked && !hasStarted){
    isStocked = true;
  }

  let sparkHolder = sparkAvailable;
  if(!isStocked){
    sparkHolder = sparkSold;
  } else if(!isExpired){
    sparkHolder = sparkExpired;
  } else if(!hasStarted){
    sparkHolder = sparkComingSoon;
  }

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
        {stock != undefined && (<><div className="carousel-item-card__image-overlay"></div>
        <><div className="carousel-item-card__image-tag"><img src={sparkHolder} alt="status"/></div></></>)}
      </div>
      <span className="carousel-item-card__title" >{title}</span>
    </button>
  );
}
