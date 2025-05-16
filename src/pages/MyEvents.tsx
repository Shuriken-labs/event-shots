
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const MyEvents = () => {
  const { getUserEvents } = useApp();
  const events = getUserEvents();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">My Events</h1>
          <Link to="/create-event">
            <Button>Create New Event</Button>
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="gradient-bg text-white">
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-medium mb-2">{event.location}</div>
                    {event.description && (
                      <p className="text-sm line-clamp-2">{event.description}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Link to={`/event/${event.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/event/${event.id}/qrcode`}>
                      <Button variant="secondary" size="sm" className="gap-1">
                        <QrCode className="h-4 w-4" />
                        QR Code
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <h2 className="text-2xl font-medium mb-2">No Events Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't created or joined any events yet. Create your first event or join one by scanning a QR code.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/create-event">
                <Button>Create Event</Button>
              </Link>
              <Link to="/join-event">
                <Button variant="outline">Join Event</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyEvents;
