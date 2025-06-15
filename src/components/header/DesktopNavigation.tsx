
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationItem } from "./NavigationData";

interface DesktopNavigationProps {
  navItems: NavigationItem[];
}

const DesktopNavigation = ({ navItems }: DesktopNavigationProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMouseEnter = (itemName: string) => {
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Group navigation items for better organization
  const primaryItems = navItems.slice(0, 5); // Engineering, Management, Medical, Design, More
  const secondaryItems = navItems.slice(5); // Online, Exams, Articles, Courses

  return (
    <nav className="hidden lg:flex items-center justify-center w-full">
      <div className="flex items-center justify-center flex-wrap gap-1">
        {/* Primary navigation items */}
        <div className="flex items-center space-x-1">
          {primaryItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.path}
                className={`flex items-center px-2 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap ${
                  item.isHighlighted
                    ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.name}
                {item.hasDropdown && (
                  <ChevronDown size={12} className="ml-1" />
                )}
              </Link>

              {/* Desktop Dropdown Menu */}
              {item.hasDropdown && activeDropdown === item.name && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-[60] animate-fade-in">
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

        {/* Separator */}
        <div className="hidden xl:block w-px h-6 bg-gray-300 mx-2"></div>

        {/* Secondary navigation items */}
        <div className="hidden xl:flex items-center space-x-1">
          {secondaryItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-2 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap ${
                item.isHighlighted
                  ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavigation;
