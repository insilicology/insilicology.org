'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthButton from './AuthButton';

const navLinks = [
  { label: "Home", route: "/" },
  { label: "Courses", route: "/courses" },
  { label: "Blog", route: "/blog" },
  { label: "Contact", route: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleMobileNavClick = (route: string) => {
    setMenuOpen(false);
    router.push(route);
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logos/icon-insilicology.svg" 
                alt="Insilicology" 
                width={40} 
                height={40} 
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold text-gray-900">Insilicology</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.route}
                  className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-t-lg hover:bg-gray-100 transition-all duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full"></span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth Button */}
          <div className="hidden lg:block">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <AuthButton />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1],
              staggerChildren: 0.05
            }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl rounded-b-2xl z-50 overflow-hidden"
          >
            {/* Mobile Navigation */}
            <motion.nav 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="p-4"
            >
              <div className="space-y-1">
                {navLinks.map((item, index) => (
                  <motion.button
                    key={item.route}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => handleMobileNavClick(item.route)}
                    className="flex items-center w-full text-left px-4 py-3.5 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex-1">{item.label}</span>
                    <motion.div 
                      className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.nav>

            {/* Mobile Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl"
            >
              <div className="text-center text-xs text-gray-500">
                © 2024 Insilicology. All rights reserved.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
