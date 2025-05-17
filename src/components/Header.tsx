
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { WalletConnector } from "./WallenConnector";

const Header = () => {
  const { currentUser } = useApp();

  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center">
            <span className="text-white font-bold">ES</span>
          </div>
          <h1 className="text-xl font-bold gradient-text">EventShots</h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/create-event">
            <Button variant="ghost">Create Event</Button>
          </Link>
          <Link to="/my-events">
            <Button variant="ghost">My Events</Button>
          </Link>
          <Link to="/">
            <WalletConnector />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
