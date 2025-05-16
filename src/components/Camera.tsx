
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Image } from 'lucide-react';

interface CameraProps {
  onPhotoCapture: (imageData: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please ensure you've granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg');
        onPhotoCapture(imageData);
        
        // Stop the camera after capturing
        stopCamera();
      }
    }
  };

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {cameraError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {cameraError}
        </div>
      )}
      
      <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Image className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex gap-4">
        {!isCameraActive ? (
          <Button 
            onClick={startCamera} 
            className="w-40 gap-2"
            size="lg"
          >
            <CameraIcon className="w-4 h-4" />
            Start Camera
          </Button>
        ) : (
          <Button 
            onClick={capturePhoto} 
            variant="default"
            className="w-40 gap-2 gradient-bg animate-pulse-light"
            size="lg"
          >
            <CameraIcon className="w-4 h-4" />
            Capture Photo
          </Button>
        )}
      </div>
    </div>
  );
};

export default Camera;
