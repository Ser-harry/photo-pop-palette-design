
import { Link } from "react-router-dom";

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">C</span>
      </div>
      <span className="text-xl font-bold text-gray-900 hidden sm:block">
        College<span className="text-orange-500">Sera</span>
      </span>
    </Link>
  );
};

export default HeaderLogo;
