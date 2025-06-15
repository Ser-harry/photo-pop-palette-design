
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserAuthenticationProps {
  onBookingClick: () => void;
}

const UserAuthentication = ({ onBookingClick }: UserAuthenticationProps) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <SignedOut>
        <Link to="/auth">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm">
            Sign In
          </Button>
        </Link>
      </SignedOut>

      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.firstName || 'User'}
              </span>
              <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem className="sm:hidden">
              <span className="text-sm font-medium text-gray-900">
                {user?.firstName || 'User'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-sm text-gray-600">
                {user?.emailAddresses[0]?.emailAddress}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onBookingClick}>
              Book Consultation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  );
};

export default UserAuthentication;
