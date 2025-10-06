'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaBiking, FaWrench, FaBell } from "react-icons/fa";
import { MdOutlineLocationOn, MdOutlineFactory, MdHome } from "react-icons/md";

export default function Sidebar() {     
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { id: "overview", path: "/overview", label: "Overview", icon: <MdOutlineFactory size={18} /> },
    { id: "stations", path: "/stations", label: "Stations", icon: <MdOutlineLocationOn size={18} /> },
    { id: "bikes", path: "/bikes", label: "Bikes", icon: <FaBiking size={18} /> },
    { id: "maintenance", path: "/maintenance", label: "Maintenance", icon: <FaWrench size={18} /> },
  ];

  return (
    <aside className="bg-[#0f172a] text-gray-300 w-64 h-screen flex flex-col py-6 px-3 sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-3">
        <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white font-bold">✓</span>
        </div>
        <h1 className="text-lg font-semibold text-white">BiciTec</h1>
      </div>

      <nav className="flex flex-col gap-1">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path) ? 'bg-blue-600 text-white' : 'hover:bg-blue-900/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
