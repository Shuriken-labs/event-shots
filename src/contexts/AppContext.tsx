
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Photo, User } from '../types';

interface AppContextType {
  events: Event[];
  photos: Photo[];
  currentUser: User | null;
  currentEvent: Event | null;
  addEvent: (event: Event) => void;
  addPhoto: (photo: Photo) => void;
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
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });
  
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const storedPhotos = localStorage.getItem('photos');
    return storedPhotos ? JSON.parse(storedPhotos) : [];
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : {
      id: 'user-' + Date.now(),
      name: 'Demo User',
      email: 'demo@eventshots.app'
    };
  });
  
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  
  const [checkedInEvents, setCheckedInEvents] = useState<string[]>(() => {
    const storedCheckins = localStorage.getItem('checkedInEvents');
    return storedCheckins ? JSON.parse(storedCheckins) : [];
  });

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);
  
  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);
  
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);
  
  useEffect(() => {
    localStorage.setItem('checkedInEvents', JSON.stringify(checkedInEvents));
  }, [checkedInEvents]);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const addPhoto = (photo: Photo) => {
    setPhotos([...photos, photo]);
  };

  const getEventPhotos = (eventId: string) => {
    return photos.filter(photo => photo.eventId === eventId);
  };

  const getUserPhotos = (userId: string) => {
    return photos.filter(photo => photo.takenBy === userId);
  };

  const getUserEvents = () => {
    return events.filter(event => event.createdBy === currentUser?.id || checkedInEvents.includes(event.id));
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
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
