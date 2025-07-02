"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, Users, CreditCard, BookOpen, BookMarked } from "lucide-react";

type SubMenuItem = { name: string; href: string };

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  {
    name: "My Courses",
    subItems: [
      { name: "All Courses", href: "/dashboard/my-courses" },
      { name: "Live Courses", href: "/dashboard/my-courses/live" },
      { name: "Recorded Courses", href: "/dashboard/my-courses/recorded" },
    ],
    icon: <BookMarked size={18} />,
  },
  { name: "Resources", href: "/dashboard/resources", icon: <BookOpen size={18} />, },
  { name: "Payments", href: "/dashboard/payments", icon: <CreditCard size={18} />, },
  { name: "Support", href: "/dashboard/support", icon: <Users size={18} /> },
];

interface DashboardSidebarProps {
  onClose?: () => void;
}

export default function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Check if a menu item is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Check if a submenu item is active
  const isSubItemActive = (href: string) => {
    return pathname === href;
  };

  // Check if a parent menu with subitems should be open/active
  const isParentActive = (subItems: SubMenuItem[]) => {
    return subItems.some(sub => isSubItemActive(sub.href));
  };

  return (
    <aside className="w-64 h-screen bg-white/80 shadow-xl border-r border-gray-200 backdrop-blur-lg p-4 relative flex flex-col transition-all duration-300">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 hover:bg-amber-100 shadow-md md:hidden transition-colors"
          aria-label="Close sidebar"
        >
          <span className="sr-only">Close</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L14 14M6 14L14 6" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {/* Logo */}
      <div className="mb-4 flex px-4 pt-1">
        <Image src="/logos/icon-insilicology.svg" alt="Logo" width={40} height={40} />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <button
                onClick={() => toggleMenu(item.name)}
                className={`flex items-center justify-between w-full px-4 py-2 font-medium border-1 border-transparent rounded-lg transition-all duration-150 hover:bg-amber-100 focus:bg-amber-100 focus:text-amber-700 group cursor-pointer ${
                  isParentActive(item.subItems) ? 'bg-amber-300 text-black' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon} <span>{item.name}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openMenus[item.name] || isParentActive(item.subItems) ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 font-medium border-1 border-transparent rounded-lg transition-all duration-150 hover:bg-amber-100 focus:bg-amber-100 focus:text-amber-700 ${
                  isActive(item.href) ? 'bg-amber-300 text-black hover:bg-amber-300' : ''
                }`}
                onClick={onClose}
              >
                {item.icon} <span>{item.name}</span>
              </Link>
            )}

            {/* Sub Items */}
            {item.subItems && (openMenus[item.name] || isParentActive(item.subItems)) && (
              <div className="ml-7 mt-1 space-y-1">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    className={`block px-4 py-2 rounded-lg transition-all duration-150 hover:bg-amber-100 focus:bg-amber-100 focus:text-amber-700 ${
                      isSubItemActive(sub.href) ? 'bg-amber-300 text-black hover:bg-amber-300' : ''
                    }`}
                    onClick={onClose}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
