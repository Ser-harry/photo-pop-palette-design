
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  onBookingClick: () => void;
}

const Header = ({ onBookingClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Colleges", path: "/colleges" },
    { name: "Exams", path: "/exams" },
    { name: "Courses", path: "/courses" },
    { name: "TNEA Predictor", path: "/tnea-predictor" },
    { name: "Articles", path: "/articles" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">KollegeApply</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBookingClick}
              className="hidden lg:flex bg-orange-500 hover:bg-orange-600 text-white"
            >
              Book Consultation
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Button
                onClick={() => {
                  onBookingClick();
                  setIsMenuOpen(false);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
              >
                Book Consultation
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
