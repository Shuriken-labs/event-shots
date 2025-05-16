
export const generateEventQRCode = (eventId: string): string => {
  // In a real app, we'd generate a proper QR code
  // But for demo, we'll just return a unique string 
  // that mimics a QR code data URL
  return `https://eventshots.app/event/${eventId}`;
};
