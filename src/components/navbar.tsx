'use client'

import { useState } from "react";
import { FaBiking, FaWrench, FaBell } from "react-icons/fa";
import { MdOutlineLocationOn, MdOutlineFactory } from "react-icons/md";

export default function Sidebar() {     
  const [active, setActive] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: <MdOutlineFactory size={18} /> },
    { id: "stations", label: "Stations", icon: <MdOutlineLocationOn size={18} /> },
    { id: "bikes", label: "Bikes", icon: <FaBiking size={18} /> },
    { id: "maintenance", label: "Maintenance", icon: <FaWrench size={18} /> },
    { id: "alerts", label: "Alerts", icon: <FaBell size={18} /> },
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
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
              active === item.id
                ? "bg-blue-700 text-white"
                : "hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
