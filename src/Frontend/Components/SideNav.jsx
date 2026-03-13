import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  DollarSign,
  Users,
  CalendarCheck,
  FileText,
  ClipboardList,
  LogOut
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const SideNav = () => {

  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Income", icon: <Wallet size={20} />, path: "/income" },
    { name: "Expense", icon: <CreditCard size={20} />, path: "/expense" },
    { name: "Credits", icon: <DollarSign size={20} />, path: "/credits" },
    { name: "Workers", icon: <Users size={20} />, path: "/workers" },
    { name: "Attendance", icon: <CalendarCheck size={20} />, path: "/attendance" },
    { name: "Pay Roll", icon: <DollarSign size={20} />, path: "/payroll" },
    { name: "Reports", icon: <FileText size={20} />, path: "/reports" },
    { name: "Follow ups", icon: <ClipboardList size={20} />, path: "/followups" },
  ];

  return (
    <div className="w-64 bg-[#f5f5f5] px-6 py-8 flex flex-col">

      {/* Menu */}
      <div className="space-y-6">

        {menu.map((item, index) => {

          const active = location.pathname === item.path;

          return (
            <Link key={index} to={item.path}>
              <div
                className={`flex items-center gap-4 px-3 py-5 rounded-md text-[16px] cursor-pointer
                ${
                  active
                    ? "text-yellow-500 font-medium"
                    : "text-gray-800 hover:text-yellow-500 hover:bg-gray-200"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout fixed bottom */}
      <div className="mt-auto pt-10">
        <div className="flex items-center gap-4 px-3 py-2 rounded-md text-gray-800 cursor-pointer hover:text-yellow-500 hover:bg-gray-200">
          <LogOut size={20} />
          <span>Log Out</span>
        </div>
      </div>

    </div>
  );
};

export default SideNav;