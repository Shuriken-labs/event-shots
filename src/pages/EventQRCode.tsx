import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Copy, Palette } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";

const EventQRCode = () => {
  const { eventId } = useParams();
  const { events } = useApp();
  const { toast } = useToast();
  const [qrColor, setQrColor] = useState("#3b82f6"); // Default blue-500
  const [bgColor, setBgColor] = useState("#ffffff");

  const event = events.find((e) => e.id === eventId);
  const joinUrl = `https://eventshots.app/join/${eventId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard."
    });
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${event?.name || "event"}-qr-code.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgData))
    )}`;
  };

  // Color presets
  const colorPresets = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Emerald", value: "#10b981" },
    { name: "Rose", value: "#f43f5e" }
  ];

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Go back to Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {event.name}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Share this QR code with attendees so they can join and share photos!
          </p>

          <Card className="mb-8">
            <CardContent className="pt-6 flex flex-col items-center">
              <div
                className="p-4 rounded-lg mb-6 shadow-sm transition-all duration-300"
                style={{ backgroundColor: bgColor }}
              >
                <QRCode
                  id="qr-code-svg"
                  value={joinUrl}
                  size={256}
                  level="H"
                  fgColor={qrColor}
                  bgColor={bgColor}
                  className="w-64 h-64 transition-colors duration-300"
                />
              </div>

              {/* Color customization */}
              <div className="w-full mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    QR Color
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colorPresets.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setQrColor(color.value)}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{
                        backgroundColor: color.value,
                        borderColor:
                          qrColor === color.value ? color.value : "transparent",
                        transform:
                          qrColor === color.value ? "scale(1.1)" : "scale(1)"
                      }}
                      aria-label={`Set QR color to ${color.name}`}
                    />
                  ))}
                  <div className="relative">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="absolute opacity-0 w-8 h-8 cursor-pointer"
                      id="qr-color-picker"
                    />
                    <label
                      htmlFor="qr-color-picker"
                      className=" w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground cursor-pointer flex items-center justify-center"
                    >
                      <span className="text-xs">+</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-3">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex gap-2 w-full"
                >
                  <Copy className="w-4 h-4" />
                  Copy Invite Link
                </Button>

                <Button
                  onClick={handleDownloadQR}
                  className="flex gap-2 w-full"
                >
                  <QrCode className="w-4 h-4" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link to={`/event/${eventId}`}>
              <Button variant="secondary">Back to Event</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventQRCode;
