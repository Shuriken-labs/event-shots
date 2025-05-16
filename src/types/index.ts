
export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  createdBy: string;
  qrCode: string;
}

export interface Photo {
  id: string;
  eventId: string;
  takenBy: string;
  imageUrl: string;
  timestamp: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}
