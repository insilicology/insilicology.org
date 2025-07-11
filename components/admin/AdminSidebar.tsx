'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  FileVideo,
  Users,
  ClipboardList,
  ChevronDown,
  ShieldEllipsis
} from 'lucide-react';

const adminMenu = [
  { name: 'Admin Panel', href: '/admin', icon: <ShieldEllipsis size={18} /> },
  {
    name: 'Course Management',
    icon: <BookOpen size={18} />,
    subItems: [
      { name: 'All Courses', href: '/admin/courses' },
      { name: 'Add Course', href: '/admin/courses/new' },
      { name: 'Submissions', href: '/admin/dft-submissions' },
    ],
  },
  {
    name: 'Resource Management',
    icon: <FileVideo size={18} />,
    subItems: [
      { name: 'All Resources', href: '/admin/resources' },
      { name: 'Add Resource', href: '/admin/resources/new' },
    ],
  },
  {
    name: 'Video Management',
    icon: <FileVideo size={18} />,
    subItems: [
      { name: 'All Videos', href: '/admin/recordings' },
      { name: 'Add Video', href: '/admin/recordings/new' },
    ],
  },
  {
    name: 'DFT Submissions',
    icon: <ClipboardList size={18} />,
    subItems: [
      { name: 'All Submissions', href: '/admin/dft-submissions' },
    ],
  },
  {
    name: 'User Management',
    icon: <Users size={18} />,
    subItems: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'Add User', href: '/admin/users/roles' },
    ],
  },
  { name: 'Student Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-64 bg-white h-screen shadow p-4">
      {/* Logo */}
      <div className="mb-6 flex px-4 pt-1">
        <Image src="/logos/logo-skilltori.svg" alt="Logo" width={120} height={40} />
      </div>

      {/* Menu Items */}
      <nav>
        {adminMenu.map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <button
                onClick={() => toggleMenu(item.name)}
                className="flex items-center justify-between w-full px-4 py-2 cursor-pointer font-medium border-1 border-transparent hover:bg-yellow-50 hover:text-orange-500 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {item.icon} <span>{item.name}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openMenus[item.name] ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer font-medium border-1 border-transparent hover:bg-yellow-50 hover:text-orange-500 rounded-lg"
                onClick={onClose}
              >
                {item.icon} <span>{item.name}</span>
              </Link>
            )}

            {/* Sub Items */}
            {item.subItems && openMenus[item.name] && (
              <div className="ml-8 mt-1">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    className="block px-4 py-2 cursor-pointer border-1 border-transparent hover:bg-yellow-50 hover:text-orange-500 rounded-lg"
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
