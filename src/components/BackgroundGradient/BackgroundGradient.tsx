import './BackgroundGradient.css';

interface BackgroundGradientProps {
  src: string;
  variant?: 'default' | 'welcome';
}

// Fixed, full-viewport looping video sitting behind every page in whichever
// router tree renders it — pages stay transparent so it shows through, with
// a dark scrim baked in here (not per-page) so text contrast stays
// consistent everywhere it's used.
export default function BackgroundGradient({ src, variant = 'default' }: BackgroundGradientProps) {
  return (
    <div className="background-gradient-container" aria-hidden="true">
      <img src={src} className="background-gradient-item"alt="" style={{ opacity: variant === 'welcome' ? '0.5' : '1' }} />
    </div>
  );
}
