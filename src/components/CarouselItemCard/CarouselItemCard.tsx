import './CarouselItemCard.css';

interface CarouselItemCardProps {
  imageUrl?: string;
  title: string;
  onClick: () => void;
}

export default function CarouselItemCard({ imageUrl, title, onClick }: CarouselItemCardProps) {
  return (
    <button type="button" className="carousel-item-card" onClick={onClick}>
      <div className="carousel-item-card__image">
        {imageUrl ? <img src={imageUrl} alt="" loading="lazy" /> : null}
      </div>
      <span className="carousel-item-card__title">{title}</span>
    </button>
  );
}
