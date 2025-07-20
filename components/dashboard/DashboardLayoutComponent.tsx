"use client";

import React, { ReactNode, useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayoutComponent({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close sidebar on Escape key
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className="font-[family-name:var(--font-hind-siliguri)] text-black bg-yellow-50 flex h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-sm">
        <DashboardSidebar />
      </aside>

      {/* Mobile sidebar */}
      {/* Overlay and animated sidebar */}
      <div className="md:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ${sidebarOpen ? 'backdrop-blur-sm bg-black/30 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={!sidebarOpen}
          onClick={closeSidebar}
        />
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 max-w-full z-50 bg-white/80 shadow-xl border-r border-gray-200 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} backdrop-blur-lg rounded-r-2xl overflow-auto`}
          style={{ willChange: 'transform' }}
        >
          <DashboardSidebar onClose={closeSidebar} />
        </aside>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <header className="p-2 md:p-4 sticky h-16 top-0 z-50 flex items-center justify-between bg-white shadow-sm">
          {/* Logo for mobile */}
          <Link href="/dashboard" className="block md:hidden w-[120px] shrink-0 ml-2 mt-1.5 mr-2">
            <Image
              src="/logos/icon-insilicology.svg"
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
            className="md:hidden bg-blue-100 hover:text-purple-600 rounded-full p-2 mr-2"
            aria-label="Toggle sidebar"
          >
            <EllipsisVertical size={24} />
          </button>
        </header>
        <main className="flex-1 p-2 md:p-4 overflow-auto transition-all duration-300">
          {/* Blur main content when sidebar is open on mobile */}
          <div className={sidebarOpen ? 'filter blur-sm pointer-events-none select-none' : ''}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
