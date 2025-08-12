"use client";

import React, { ReactNode, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard",
  description:
    "Insilicology admin page. All admin pages are listed here.",
  keywords: [
    "admin",
    "insilicology",
    "insilicology admin",
    "insilicology admin page",
    "insilicology admin page",
  ],
  metadataBase: new URL("https://insilicology.org"),
  alternates: {
    canonical: `/admin`,
  },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="font-[family-name:var(--font-hind-siliguri)] text-black bg-yellow-50 flex h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-sm">
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-white bg-opacity-0 z-50 md:hidden"
            onClick={closeSidebar}
          />
          <aside className="fixed inset-y-0 left-0 bg-white shadow-sm z-50 md:hidden overflow-auto">
            <AdminSidebar />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="p-2 md:p-4 sticky h-16 top-0 z-50 flex items-center justify-between bg-white shadow-sm">

          {/* Logo for mobile */}
          <Link href="/admin" className="block md:hidden w-[120px] shrink-0 ml-2 mt-1.5 mr-2">
            <Image
              src="/logos/logo-insilicology.svg"
              alt="Logo"
              width={120}
              height={40}
              className="h-auto w-full"
            />
          </Link>

          {/* Dashboard header (flex-grow) */}
          <div className="flex-1 px-2">
            <DashboardHeader />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden bg-yellow-100 hover:text-purple-600 rounded-full p-2 mr-2"
            aria-label="Toggle sidebar"
          >
            <EllipsisVertical size={24} />
          </button>
        </header>

        <main className="flex-1 p-2 md:p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
