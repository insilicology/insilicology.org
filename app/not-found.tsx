"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 text-center px-6">
      {/* 404 Icon */}
      <div className="animate-float mb-8">
        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-200">
          <div className="text-center">
            <div className="text-6xl font-bold text-amber-600">404</div>
            <div className="text-sm text-amber-500 font-medium">Page Not Found</div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        The page you&apos;re looking for might have been moved, deleted, or you entered the wrong URL. 
        Let&apos;s get you back on track to discovering computational biology solutions.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        
        <Link 
          href="/services" 
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-all duration-300"
        >
          <Search className="w-5 h-5" />
          Explore Services
        </Link>
      </div>

      {/* Additional Help */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Need Help?
        </h3>
        <p className="text-gray-600 mb-4">
          Can&apos;t find what you&apos;re looking for? Our computational biology experts are here to help.
        </p>
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Contact Our Team
        </Link>
      </div>

      {/* Floating animation */}
      <style jsx>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0% {
            transform: translatey(0px);
          }
          50% {
            transform: translatey(-20px);
          }
          100% {
            transform: translatey(0px);
          }
        }
      `}</style>
    </div>
  );
}
