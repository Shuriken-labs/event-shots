
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { QrCode, Camera, Image } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
              Never Miss an Event Photo Again
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Attend events, scan QR codes, capture memories, and find all the photos you're in
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/create-event">
                <Button size="lg" className="gradient-bg">
                  Create an Event
                </Button>
              </Link>
              <Link to="/join-event">
                <Button size="lg" variant="outline">
                  Join Event with QR Code
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="h-12 w-12 gradient-bg rounded-full flex items-center justify-center mb-4">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Scan to Join</h2>
            <p className="text-muted-foreground">
              Easily join events by scanning the event's QR code
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="h-12 w-12 gradient-bg rounded-full flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Capture Moments</h2>
            <p className="text-muted-foreground">
              Take photos within the app and they're automatically shared with the event
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="h-12 w-12 gradient-bg rounded-full flex items-center justify-center mb-4">
              <Image className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Find Your Photos</h2>
            <p className="text-muted-foreground">
              Access all photos from your events in one place
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
