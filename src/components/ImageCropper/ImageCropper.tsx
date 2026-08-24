import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import './ImageCropper.css';

interface ImageCropperProps {
  imageSrc: string;
}

export interface ImageCropperHandle {
  getCroppedImage: () => Promise<string | null>;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function cropToBase64(imageSrc: string, area: Area): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  return canvas.toDataURL('image/png');
}

const ImageCropper = forwardRef<ImageCropperHandle, ImageCropperProps>(({ imageSrc }, ref) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixelsRef = useRef<Area | null>(null);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    croppedAreaPixelsRef.current = areaPixels;
  }, []);

  useImperativeHandle(ref, () => ({
    getCroppedImage: async () => {
      if (!croppedAreaPixelsRef.current) return null;
      return cropToBase64(imageSrc, croppedAreaPixelsRef.current);
    },
  }));

  return (
    <div className="image-cropper">
      <div className="image-cropper__stage">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>
      <input
        className="image-cropper__zoom"
        type="range"
        min={1}
        max={3}
        step={0.05}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      />
    </div>
  );
});

ImageCropper.displayName = 'ImageCropper';

export default ImageCropper;
