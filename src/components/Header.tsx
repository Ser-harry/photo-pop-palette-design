import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import SearchAutocomplete from "./SearchAutocomplete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onBookingClick: () => void;
}

const Header = ({ onBookingClick }: HeaderProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    {
      name: "Engineering",
      hasDropdown: true,
      path: "/colleges?category=engineering",
      dropdownItems: [
        { name: "Computer Science", path: "/colleges?category=engineering&field=cs" },
        { name: "Mechanical", path: "/colleges?category=engineering&field=mechanical" },
        { name: "Electronics", path: "/colleges?category=engineering&field=electronics" },
        { name: "Civil", path: "/colleges?category=engineering&field=civil" },
      ]
    },
    {
      name: "Management",
      hasDropdown: true,
      path: "/colleges?category=mba",
      dropdownItems: [
        { name: "MBA", path: "/colleges?category=mba" },
        { name: "PGDM", path: "/colleges?category=pgdm" },
        { name: "Executive MBA", path: "/colleges?category=executive-mba" },
      ]
    },
    {
      name: "Medical",
      hasDropdown: true,
      path: "/colleges?category=medical",
      dropdownItems: [
        { name: "MBBS", path: "/colleges?category=medical&field=mbbs" },
        { name: "BDS", path: "/colleges?category=medical&field=bds" },
        { name: "Nursing", path: "/colleges?category=medical&field=nursing" },
        { name: "Pharmacy", path: "/colleges?category=medical&field=pharmacy" },
      ]
    },
    {
      name: "Design",
      hasDropdown: true,
      path: "/colleges?category=design",
      dropdownItems: [
        { name: "Fashion Design", path: "/colleges?category=design&field=fashion" },
        { name: "Interior Design", path: "/colleges?category=design&field=interior" },
        { name: "Graphic Design", path: "/colleges?category=design&field=graphic" },
      ]
    },
    {
      name: "More",
      hasDropdown: true,
      path: "/colleges",
      dropdownItems: [
        { name: "Law", path: "/colleges?category=law" },
        { name: "Arts", path: "/colleges?category=arts" },
        { name: "Commerce", path: "/colleges?category=commerce" },
        { name: "Science", path: "/colleges?category=science" },
      ]
    },
    { name: "Online", path: "/colleges?mode=online", hasDropdown: false, isHighlighted: true },
    { name: "Exams", path: "/exams", hasDropdown: false },
    { name: "Articles", path: "/articles", hasDropdown: false },
    { name: "Courses", path: "/courses", hasDropdown: false },
  ];

  const handleMouseEnter = (itemName: string) => {
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              College<span className="text-orange-500">Sera</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                      item.isHighlighted
                        ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown size={16} className="ml-1" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-2">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Search and CTA */}
          <div className="flex items-center space-x-4">
            {/* Search Bar with Autocomplete */}
            <div className="bg-gray-100 rounded-lg px-3 py-2 min-w-[300px]">
              <SearchAutocomplete
                placeholder="Search colleges, courses..."
                variant="header"
                showIcon={true}
                className="w-full"
                inputClassName="bg-transparent text-gray-700 placeholder:text-gray-500"
              />
            </div>

            {/* Authentication Section */}
            <SignedOut>
              <Link to="/auth">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                  Sign In
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName || 'User'}
                    </span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
