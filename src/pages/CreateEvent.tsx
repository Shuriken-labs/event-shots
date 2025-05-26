import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { generateEventQRCode } from "@/utils/qrGenerator";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from "@starknet-react/core";

const CreateEvent = () => {
  const { currentUser, addEvent } = useApp();
  const { address } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: ""
  });

  useEffect(() => {
    if (!address) {
      navigate("/");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    const eventId = `event-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const qrCodeData = generateEventQRCode(eventId);

    const newEvent = {
      id: eventId,
      name: formData.name,
      date: formData.date,
      location: formData.location,
      description: formData.description,
      createdBy: currentUser?.id || "",
      qrCode: qrCodeData
    };

    addEvent(newEvent);

    toast({
      title: "Event created!",
      description: "Your event has been successfully created."
    });

    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 gradient-text">
            Create a New Event
          </h1>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter event description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full gradient-bg">
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
