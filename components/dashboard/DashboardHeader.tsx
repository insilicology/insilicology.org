"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  UserCog,
  Globe,
  LogOut,
  PanelsTopLeft,
} from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      // Pull Google avatar URL if available
      const avatar = session.user.user_metadata?.avatar_url || null;
      setAvatarUrl(avatar);

      setLoading(false);
    }

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          router.replace("/login");
          return;
        }
        
        const avatar = session.user.user_metadata?.avatar_url || null;
        setAvatarUrl(avatar);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) return null;

  return (
    <div className="flex justify-end w-full items-center p-2 md:p-4 relative">
      <div
        className={`relative group ${isMobile ? "" : "hover:group-hover:block"}`}
        ref={dropdownRef}
      >
        {/* Trigger */}
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer bg-white/60 backdrop-blur-md shadow-md rounded-full md:bg-gray-100 md:shadow-none md:backdrop-blur-0 transition-all duration-200 border border-gray-200 hover:border-purple-300"
          onClick={() => isMobile && setDropdownOpen(prev => !prev)}
        >
          {/* Desktop text */}
          <span className="hidden md:inline-block font-semibold text-gray-700 text-sm pl-4">
            Account Options
          </span>

          {/* Avatar image or default icon */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-300 shadow-md hover:shadow-lg transition-all duration-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center border-2 border-purple-300 shadow-md">
              <UserCog className="text-white w-6 h-6" />
            </div>
          )}
        </div>

        {/* Dropdown */}
        <div
          className={`absolute right-0 mt-0 mr-2 w-56 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl z-50 transition-all duration-200 origin-top-right
            ${isMobile
              ? dropdownOpen
                ? "opacity-100 visible scale-100 pointer-events-auto"
                : "opacity-0 invisible scale-95 pointer-events-none"
              : "opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:pointer-events-auto scale-95 pointer-events-none"}`}
          style={{ top: "100%" }}
        >
          <ul className="divide-y divide-gray-100">
            <li>
              <Link
                href="/dashboard/account"
                className="flex items-center gap-2 px-5 py-3 rounded-t-xl hover:bg-white hover:text-purple-700 transition-all text-base font-medium"
              >
                <UserCog size={20} />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/support"
                className="flex items-center gap-2 px-5 py-3 hover:bg-white hover:text-purple-700 transition-all text-base font-medium"
              >
                <PanelsTopLeft size={20} />
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="flex items-center gap-2 px-5 py-3 hover:bg-white hover:text-purple-700 transition-all text-base font-medium"
              >
                <Globe size={20} />
                Main Website
              </Link>
            </li>

            {/* <li><hr className="my-2 border-gray-200" /></li> */}

            <li>
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer rounded-b-xl gap-2 w-full px-5 py-3 hover:bg-red-100 hover:text-red-600 transition-all text-base font-semibold"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
