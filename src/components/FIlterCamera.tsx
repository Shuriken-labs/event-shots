import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Camera,
  X,
  RotateCcw,
  Zap,
  Sparkles,
  Sun,
  Moon,
  Palette,
  Download,
  Maximize2,
  Minimize2
} from "lucide-react";

const FILTERS = {
  none: { name: "Original", icon: Camera, filter: "none" },
  grayscale: { name: "B&W", icon: Moon, filter: "grayscale(100%)" },
  sepia: { name: "Vintage", icon: Sun, filter: "sepia(80%) saturate(120%)" },
  vivid: {
    name: "Vivid",
    icon: Sparkles,
    filter: "saturate(150%) contrast(110%)"
  },
  cool: {
    name: "Cool",
    icon: Zap,
    filter: "hue-rotate(180deg) saturate(120%)"
  },
  warm: {
    name: "Warm",
    icon: Palette,
    filter: "sepia(30%) saturate(130%) hue-rotate(15deg)"
  }
};

const EnhancedCamera = ({ onPhotoCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState("user"); // 'user' for front, 'environment' for back
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error("Camera error:", err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const switchCamera = async () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);

    // Add capture animation
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply filter to canvas
    ctx.filter = FILTERS[selectedFilter].filter;
    ctx.drawImage(video, 0, 0);

    // Convert to data URL
    const imageData = canvas.toDataURL("image/jpeg", 0.9);

    // Trigger flash effect
    setTimeout(() => {
      setIsCapturing(false);
      onPhotoCapture(imageData);
    }, 200);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (error) {
    return (
      <div className="relative w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-6">
          <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Camera Unavailable</p>
          <p className="text-sm opacity-75">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 bg-black"
          : "relative w-full max-w-md mx-auto"
      } bg-black rounded-2xl overflow-hidden shadow-2xl ${
        isFullscreen ? "rounded-none" : ""
      }`}
    >
      {/* Camera View */}
      <div
        className={`relative ${
          isFullscreen ? "h-screen" : "aspect-[3/4]"
        } bg-gray-900`}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-all duration-300 ${
            selectedFilter !== "none" ? `filter` : ""
          }`}
          style={{
            filter: FILTERS[selectedFilter].filter,
            transform: facingMode === "user" ? "scaleX(-1)" : "none"
          }}
        />

        {/* Flash overlay */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-pulse" />
        )}

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="text-sm font-medium">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm font-medium">Fullscreen</span>
              </>
            )}
          </button>

          <button
            onClick={switchCamera}
            className="p-3 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
            disabled={isCapturing}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Filter selector */}
        <div
          className={`absolute ${
            isFullscreen ? "bottom-32" : "bottom-20"
          } left-0 right-0 z-10`}
        >
          <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
            {Object.entries(FILTERS).map(([key, filter]) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    selectedFilter === key
                      ? "bg-white text-black shadow-lg scale-110"
                      : "bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs font-medium">{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capture button */}
        <div
          className={`absolute ${
            isFullscreen ? "bottom-8" : "bottom-6"
          } left-1/2 transform -translate-x-1/2 z-10`}
        >
          <button
            onClick={capturePhoto}
            disabled={!isActive || isCapturing}
            className={`${
              isFullscreen ? "w-20 h-20" : "w-16 h-16"
            } rounded-full border-4 border-white bg-white/20 backdrop-blur-sm transition-all duration-200 ${
              isActive && !isCapturing
                ? "hover:scale-110 active:scale-95 hover:bg-white/30"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <div
              className={`w-full h-full rounded-full bg-white transition-all duration-200 ${
                isCapturing ? "scale-75" : "scale-100"
              }`}
            />
          </button>
        </div>

        {/* Loading indicator */}
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center gap-4 text-white">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Starting camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for photo processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// Main component that can be used in your EventDetail page
const CameraView = ({ onPhotoCapture }) => {
  const [showCamera, setShowCamera] = useState(false);

  if (!showCamera) {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Camera className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Ready to capture memories?
        </h3>
        <p className="text-gray-600 mb-6">
          Take photos with beautiful filters and effects
        </p>
        <button
          onClick={() => setShowCamera(true)}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Open Camera
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <EnhancedCamera
        onPhotoCapture={(imageData) => {
          onPhotoCapture(imageData);
          setShowCamera(false);
        }}
        onClose={() => setShowCamera(false)}
      />
    </div>
  );
};

export default CameraView;
