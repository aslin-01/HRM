import { Bell, UserCircle } from "lucide-react";
import logo from "../../assets/logo.png";

const TopNav = () => {
  return (
    <div className="flex justify-between items-center bg-white px-8 py-4 shadow">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="logo"
          className="w-10 h-10"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">

        <Bell className="text-yellow-500 cursor-pointer" />

        <div className="flex items-center gap-2">
          <UserCircle size={32} />
          <div className="text-sm">
            <p className="font-semibold">Joseph</p>
            <p className="text-gray-500">Administrator</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopNav;