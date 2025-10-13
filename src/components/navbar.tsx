"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaBiking, FaWrench } from "react-icons/fa";
import { MdOutlineLocationOn, MdOutlineFactory } from "react-icons/md";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./auth/UserMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin, user, isLoading } = useAuth();
  const t = useTranslations("Sidebar");
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      id: "overview",
      path: "/overview",
      label: t("menu.overview"),
      icon: <MdOutlineFactory size={18} />,
    },
    {
      id: "stations",
      path: "/stations",
      label: t("menu.stations"),
      icon: <MdOutlineLocationOn size={18} />,
    },
    {
      id: "bikes",
      path: "/bikes",
      label: t("menu.bikes"),
      icon: <FaBiking size={18} />,
    },
  ];

  // Solo agregar mantenimiento si es admin
  if (isAdmin) {
    menuItems.push({
      id: "maintenance",
      path: "/maintenance",
      label: t("menu.maintenance"),
      icon: <FaWrench size={18} />,
    });
  }

  return (
    <aside className="bg-[#0f172a] text-gray-300 w-64 h-screen flex flex-col py-6 px-3 sticky top-0 border-r border-gray-700">
      <div className="flex items-center gap-2 mb-8 px-3">
        <div>
          <Image src="/tec.png" alt="tec logo" width={20} height={20} />
        </div>

        <h1 className="text-lg font-semibold text-white">BiciTec</h1>
        <LanguageSwitcher />
      </div>

      <nav className="flex flex-col gap-1">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-900/50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <div className="px-3 py-4 border-t border-gray-700">
          {!isLoading && (
            <div className="flex justify-center">
              {user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors hover:bg-blue-900/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>{t("auth.login")}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
