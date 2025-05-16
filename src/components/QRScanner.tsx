
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Camera as CameraIcon } from 'lucide-react';

interface QRScannerProps {
  onQRCodeScanned: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onQRCodeScanned }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // In a real app, we would use a proper QR code scanning library
  // For this demo, we'll simulate a successful scan after a few seconds
  const startScanning = async () => {
    try {
      setScanError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        
        // Simulate QR code detection after 3 seconds
        setTimeout(() => {
          // Generate a mock event ID
          const mockEventId = `event-${Math.floor(Math.random() * 1000)}`;
          onQRCodeScanned(`https://eventshots.app/event/${mockEventId}`);
          
          // Stop scanning
          stopScanning();
        }, 3000);
      }
    } catch (err) {
      console.error("Error accessing camera for QR scanning:", err);
      setScanError("Could not access camera. Please ensure you've granted camera permissions.");
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {scanError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {scanError}
        </div>
      )}
      
      <div className="relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden mb-4">
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border-2 border-white/70 rounded-lg animate-pulse">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <QrCode className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>
      
      {!isScanning ? (
        <Button 
          onClick={startScanning} 
          className="gap-2"
          size="lg"
        >
          <CameraIcon className="w-4 h-4" />
          Scan QR Code
        </Button>
      ) : (
        <Button 
          onClick={stopScanning} 
          variant="outline"
          className="gap-2"
          size="lg"
        >
          Cancel Scanning
        </Button>
      )}
    </div>
  );
};

export default QRScanner;
