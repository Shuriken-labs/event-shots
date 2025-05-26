import React, { createContext, useContext, useState, useEffect } from "react";
import { Event, Photo, User } from "../types";
import contract_abi from "../dev/event_shot_EventShot.contract_class.json";
import { useAccount, useContract, useProvider } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "@/utils/constants";
import { Abi, byteArray } from "starknet";

interface AppContextType {
  events: Event[];
  photos: Photo[];
  currentUser: User | null;
  currentEvent: Event | null;
  addEvent: (event: Event) => Promise<void>;
  addPhoto: (photo: Photo) => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
  getEventPhotos: (eventId: string) => Photo[];
  getUserPhotos: (userId: string) => Photo[];
  getUserEvents: () => Event[];
  checkInToEvent: (eventId: string) => void;
  isUserCheckedIntoEvent: (eventId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  const [photos, setPhotos] = useState<Photo[]>(() => {
    const storedPhotos = localStorage.getItem("photos");
    return storedPhotos ? JSON.parse(storedPhotos) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          id: "user-" + Date.now(),
          name: "Demo User",
          email: "demo@eventshots.app"
        };
  });

  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const [checkedInEvents, setCheckedInEvents] = useState<string[]>(() => {
    const storedCheckins = localStorage.getItem("checkedInEvents");
    return storedCheckins ? JSON.parse(storedCheckins) : [];
  });

  const { provider } = useProvider();
  const { account } = useAccount();

  const { contract: contract1 } = useContract({
    abi: contract_abi.abi as Abi,
    address: CONTRACT_ADDRESS,
    provider: provider
  });

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("photos", JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("checkedInEvents", JSON.stringify(checkedInEvents));
  }, [checkedInEvents]);

  // const addEvent = (event: Event) => {
  //   setEvents([...events, event]);
  // };

  const addEvent = async (event: Event) => {
    if (!contract1 || !account) {
      console.error("Contract or account not available");
      return;
    }

    try {
      // First, add the event to the blockchain
      const tx = await account.execute({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "create_event",
        calldata: [
          event.id, // event_id: felt252
          byteArray.byteArrayFromString(event.name), // name: ByteArray (length)
          byteArray.byteArrayFromString(event.location), // location: ByteArray (length)
          Math.floor(new Date(event.date).getTime() / 1000), // date: u64 (UNIX timestamp)
          byteArray.byteArrayFromString(event.description) // description: ByteArray (length)
        ]
      });

      console.log("Create event transaction hash:", tx.transaction_hash);

      // Wait for transaction confirmation
      await provider.waitForTransaction(tx.transaction_hash, {
        successStates: ["ACCEPTED_ON_L2"]
      });

      // Only add to local state if blockchain transaction succeeds
      setEvents([...events, event]);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error; // Re-throw to handle in UI
    }
  };

  // GET ALL EVENTS
  const getAllEvents = async (): Promise<Event[]> => {
    if (!contract1 || !account?.address) return [];

    try {
      // First get event IDs created by this user
      const eventIds = await contract1.call("get_events_by_creator", [
        account.address
      ]);

      // Then fetch details for each event
      const eventsPromises = eventIds.map(async (eventId: string) => {
        // Assuming you have a "get_event_details" function in your contract
        const eventDetails = await contract1.call("get_event_details", [
          eventId
        ]);

        return {
          id: eventId,
          name: eventDetails.name,
          location: eventDetails.location,
          date: new Date(eventDetails.date * 1000).toISOString(),
          description: eventDetails.description,
          createdBy: account.address
        } as Event;
      });

      return await Promise.all(eventsPromises);
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  // GET ALL EVENT IMAGES
  const getAllEventImages = async (eventId: string): Promise<string[]> => {
    if (!contract1) return [];

    try {
      const images = await contract1.call("get_event_images", [eventId]);
      return images.map((img: any) => img.toString()); // Convert ByteArray to string
    } catch (error) {
      console.error("Error fetching event images:", error);
      return [];
    }
  };

  // ADD PHOTO (to blockchain)
  const addPhoto = async (photo: Photo) => {
    if (!contract1 || !account) {
      console.error("Contract or account not available");
      return;
    }

    try {
      // Assuming your contract has an "add_photo" function
      // with parameters: event_id: felt252, image_url: ByteArray
      const tx = await account.execute({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "add_photo", // You'll need to add this function to your contract
        calldata: [
          photo.eventId, // event_id: felt252
          byteArray.byteArrayFromString(photo.imageUrl) // image_url: ByteArray (data)
        ]
      });

      console.log("Add photo transaction hash:", tx.transaction_hash);

      await provider.waitForTransaction(tx.transaction_hash, {
        successStates: ["ACCEPTED_ON_L2"]
      });

      // Add to local state
      setPhotos([...photos, photo]);
    } catch (error) {
      console.error("Error adding photo:", error);
      throw error;
    }
  };

  // const addPhoto = (photo: Photo) => {
  //   setPhotos([...photos, photo]);
  // };

  const getEventPhotos = (eventId: string) => {
    return photos.filter((photo) => photo.eventId === eventId);
  };

  const getUserPhotos = (userId: string) => {
    return photos.filter((photo) => photo.takenBy === userId);
  };

  const getUserEvents = () => {
    return events.filter(
      (event) =>
        event.createdBy === currentUser?.id ||
        checkedInEvents.includes(event.id)
    );
  };

  const checkInToEvent = (eventId: string) => {
    if (!checkedInEvents.includes(eventId)) {
      setCheckedInEvents([...checkedInEvents, eventId]);
    }
  };

  const isUserCheckedIntoEvent = (eventId: string) => {
    return checkedInEvents.includes(eventId);
  };

  return (
    <AppContext.Provider
      value={{
        events,
        photos,
        currentUser,
        currentEvent,
        addEvent,
        addPhoto,
        setCurrentEvent,
        getEventPhotos,
        getUserPhotos,
        getUserEvents,
        checkInToEvent,
        isUserCheckedIntoEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
