import './BackgroundVideo.css';

interface BackgroundVideoProps {
  src: string;
}

// Fixed, full-viewport looping video sitting behind every page in whichever
// router tree renders it — pages stay transparent so it shows through, with
// a dark scrim baked in here (not per-page) so text contrast stays
// consistent everywhere it's used.
export default function BackgroundVideo({ src }: BackgroundVideoProps) {
  return (
    <div className="background-video" aria-hidden="true">
      <video className="background-video__el" src={src} autoPlay loop muted playsInline preload="auto" />
      <div className="background-video__scrim" />
    </div>
  );
}
