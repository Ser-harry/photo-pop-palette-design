
import MobileNavigation from "./MobileNavigation";
import HeaderLogo from "./header/HeaderLogo";
import DesktopNavigation from "./header/DesktopNavigation";
import SearchSection from "./header/SearchSection";
import UserAuthentication from "./header/UserAuthentication";
import { navItems } from "./header/NavigationData";

interface HeaderProps {
  onBookingClick: () => void;
}

const Header = ({ onBookingClick }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 items-center py-4 gap-4">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center space-x-3">
            <MobileNavigation navItems={navItems} onBookingClick={onBookingClick} />
            <HeaderLogo />
          </div>

          {/* Center: Navigation - Hidden on mobile */}
          <DesktopNavigation navItems={navItems} />

          {/* Right: Search and Auth */}
          <div className="flex items-center justify-end space-x-3">
            <SearchSection />
            <UserAuthentication onBookingClick={onBookingClick} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
