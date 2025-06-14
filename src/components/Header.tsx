
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onBookingClick: () => void;
}

const Header = ({ onBookingClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Engineering", hasDropdown: true, path: "/courses" },
    { name: "Management", hasDropdown: true, path: "/courses" },
    { name: "Medical", hasDropdown: true, path: "/courses" },
    { name: "Design", hasDropdown: true, path: "/courses" },
    { name: "More", hasDropdown: true, path: "/courses" },
    { name: "Online", hasDropdown: false, highlight: true, path: "/courses" },
    { name: "Exams", hasDropdown: false, path: "/exams" },
    { name: "Articles", hasDropdown: false, path: "/articles" },
    { name: "Courses", hasDropdown: false, path: "/courses" },
  ];

  return (
    <header className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold">
              Kollege<span className="text-orange-500">Apply</span>
            </h1>
            <span className="text-xs ml-2 opacity-75">Empowering Education</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-800 transition-colors ${
                    item.highlight ? "bg-orange-500 hover:bg-orange-600" : ""
                  } ${
                    location.pathname === item.path ? "bg-blue-800" : ""
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-blue-800 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 mr-2 opacity-75" />
              <Input
                placeholder="Search"
                className="bg-transparent border-none text-white placeholder-blue-300 focus:ring-0"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-blue-800">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-blue-800 transition-colors ${
                    item.highlight ? "bg-orange-500" : ""
                  } ${
                    location.pathname === item.path ? "bg-blue-800" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4">
              <div className="flex items-center bg-blue-800 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 mr-2 opacity-75" />
                <Input
                  placeholder="Search"
                  className="bg-transparent border-none text-white placeholder-blue-300 focus:ring-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
