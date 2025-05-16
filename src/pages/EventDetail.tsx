
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Camera from "@/components/Camera";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera as CameraIcon, Image } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";
import { Photo } from "@/types";

const EventDetail = () => {
  const { eventId } = useParams();
  const { events, currentUser, getEventPhotos, addPhoto, isUserCheckedIntoEvent, checkInToEvent } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("gallery");
  const [eventPhotos, setEventPhotos] = useState<Photo[]>([]);

  const event = events.find(e => e.id === eventId);
  const isCheckedIn = eventId ? isUserCheckedIntoEvent(eventId) : false;

  useEffect(() => {
    if (eventId) {
      setEventPhotos(getEventPhotos(eventId));
    }
  }, [eventId, getEventPhotos]);

  const handleCheckIn = () => {
    if (eventId) {
      checkInToEvent(eventId);
      toast({
        title: "Checked in!",
        description: `You've successfully checked in to ${event?.name}!`
      });
    }
  };

  const handlePhotoCapture = (imageData: string) => {
    if (!eventId || !currentUser) return;

    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      eventId,
      takenBy: currentUser.id,
      imageUrl: imageData,
      timestamp: new Date().toISOString(),
      tags: []
    };

    addPhoto(newPhoto);
    setEventPhotos(prev => [...prev, newPhoto]);
    
    toast({
      title: "Photo captured!",
      description: "Your photo has been added to the event gallery."
    });
    
    setActiveTab("gallery");
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">{event.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{event.location}</span>
            </div>
            {event.description && (
              <p className="mt-4">{event.description}</p>
            )}
          </div>

          {!isCheckedIn && (
            <Card className="mb-8">
              <CardContent className="pt-6 text-center">
                <p className="mb-4">
                  Check in to this event to capture and view photos
                </p>
                <Button onClick={handleCheckIn} className="gradient-bg">
                  Check in to Event
                </Button>
              </CardContent>
            </Card>
          )}

          {isCheckedIn && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gallery" className="flex gap-2">
                  <Image className="w-4 h-4" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex gap-2">
                  <CameraIcon className="w-4 h-4" />
                  Take Photos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="mt-4">
                {eventPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {eventPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="aspect-square rounded-md overflow-hidden bg-muted"
                      >
                        <img
                          src={photo.imageUrl}
                          alt="Event photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-md">
                    <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium mb-2">No Photos Yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Be the first to capture a moment at this event!
                    </p>
                    <Button onClick={() => setActiveTab('camera')} className="gap-2">
                      <CameraIcon className="w-4 h-4" />
                      Take a Photo
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="camera" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <Camera onPhotoCapture={handlePhotoCapture} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
