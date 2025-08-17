import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Zap, Target, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-pulse delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4" />
              Leading in Computational Chemistry & Life Science
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Computational Chemistry
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Life Science Solutions
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
              Cutting-edge molecular modeling and drug discovery services for researchers and academic institutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/services"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Services
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-purple-500 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300"
              >
                Get in Touch
                <Play className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-gray-600 text-sm">Research Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">50+</div>
                <div className="text-gray-600 text-sm">Academic Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">95%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative">
            {/* Main Illustration Container */}
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* Central Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full shadow-2xl flex items-center justify-center">
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <span className="text-lg font-bold text-gray-800">InSilicology</span>
                  </div>
                </div>
              </div>

              {/* Orbiting Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                <div className="w-80 h-80 border-2 border-purple-300 rounded-full opacity-30"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow-reverse">
                <div className="w-72 h-72 border-2 border-pink-300 rounded-full opacity-30"></div>
              </div>

              {/* Floating Icons */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-16 right-12 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-1000">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-16 left-12 w-14 h-14 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-500">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="absolute bottom-8 right-8 w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-1500">
                <Zap className="w-5 h-5 text-white" />
              </div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="80%" y1="20%" x2="20%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
