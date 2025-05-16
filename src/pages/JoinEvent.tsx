
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import QRScanner from "@/components/QRScanner";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";

const JoinEvent = () => {
  const { events, checkInToEvent } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleQRCodeScanned = (data: string) => {
    // Extract eventId from QR code data
    const eventIdMatch = data.match(/\/event\/([^\/]+)/);
    
    if (eventIdMatch && eventIdMatch[1]) {
      const eventId = eventIdMatch[1];
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        // Check user into event
        checkInToEvent(eventId);
        
        toast({
          title: "Event Joined!",
          description: `You have successfully joined ${event.name}!`
        });
        
        // Navigate to event page
        navigate(`/event/${eventId}`);
      } else {
        toast({
          title: "Event Not Found",
          description: "Could not find the event associated with this QR code.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Invalid QR Code",
        description: "This QR code doesn't seem to be for an event.",
        variant: "destructive"
      });
    }
    
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 gradient-text text-center">Join an Event</h1>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <p className="text-center mb-6">
                Scan the event QR code to join and start sharing photos!
              </p>
              
              <QRScanner onQRCodeScanned={handleQRCodeScanned} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default JoinEvent;
