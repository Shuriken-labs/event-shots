
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Copy } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";

const EventQRCode = () => {
  const { eventId } = useParams();
  const { events } = useApp();
  const { toast } = useToast();
  
  const event = events.find(e => e.id === eventId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://eventshots.app/join/${eventId}`);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard."
    });
  };

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
          <h1 className="text-3xl font-bold mb-2 gradient-text text-center">{event.name}</h1>
          <p className="text-center text-muted-foreground mb-8">
            Share this QR code with attendees so they can join and share photos!
          </p>
          
          <Card className="mb-8">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-6">
                {/* In a real app, we'd generate a proper QR code SVG */}
                {/* This is a placeholder */}
                <div className="w-64 h-64 border-8 border-primary/20 flex items-center justify-center rounded-lg">
                  <QrCode className="w-40 h-40 text-primary" />
                </div>
              </div>
              
              <Button 
                onClick={handleCopyLink} 
                variant="outline" 
                className="flex gap-2 w-full"
              >
                <Copy className="w-4 h-4" />
                Copy Invite Link
              </Button>
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
