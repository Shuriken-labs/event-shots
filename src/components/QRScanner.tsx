import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, X } from "lucide-react";

interface QRScannerProps {
  onQRCodeScanned: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onQRCodeScanned }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>("");

  const startCamera = async () => {
    try {
      setError("");

      // Simple, reliable constraints
      const constraints = {
        video: {
          facingMode: "environment"
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);

        // Simulate QR detection after 3 seconds
        setTimeout(() => {
          const mockId = Date.now().toString();
          onQRCodeScanned(`https://eventshots.app/event/${mockId}`);
          stopCamera();
        }, 7000);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative bg-gray-900 rounded-lg overflow-hidden mb-4"
        style={{ aspectRatio: "1" }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ display: isActive ? "block" : "none" }}
        />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode size={64} className="text-gray-400" />
          </div>
        )}

        {isActive && (
          <>
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="border-2 border-white border-opacity-50 rounded-lg"
                style={{ width: "70%", height: "70%" }}
              >
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400"></div>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              Align QR code within frame
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <Button onClick={startCamera} className="flex-1 gap-2">
            <Camera size={16} />
            Start Scanner
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="outline"
            className="flex-1 gap-2"
          >
            <X size={16} />
            Stop Scanner
          </Button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
