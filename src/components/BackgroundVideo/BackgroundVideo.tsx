import './BackgroundVideo.css';

interface BackgroundVideoProps {
  src: string;
  variant?: 'default' | 'welcome';
}

// Fixed, full-viewport looping video sitting behind every page in whichever
// router tree renders it — pages stay transparent so it shows through, with
// a dark scrim baked in here (not per-page) so text contrast stays
// consistent everywhere it's used.
export default function BackgroundVideo({ src, variant = 'default' }: BackgroundVideoProps) {
  


   const videoClass = variant === 'welcome' ? 'background-video__el-welcome' : 'background-video__el';



  return (
    <>   <div className="background-video" aria-hidden="true">
      <video className={videoClass} src={src} autoPlay loop muted playsInline preload="metadata" />
      <div className="background-video__scrim" />
    </div></>
  );
}
