
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateEvent from "./pages/CreateEvent";
import JoinEvent from "./pages/JoinEvent";
import EventDetail from "./pages/EventDetail";
import MyEvents from "./pages/MyEvents";
import EventQRCode from "./pages/EventQRCode";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/join-event" element={<JoinEvent />} />
            <Route path="/event/:eventId" element={<EventDetail />} />
            <Route path="/event/:eventId/qrcode" element={<EventQRCode />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
