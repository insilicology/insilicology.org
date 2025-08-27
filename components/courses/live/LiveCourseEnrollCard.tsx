"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Award, CheckCircle, Star, Calendar, Video } from "lucide-react";
import { CourseEnrollCardProps } from "@/types/course.type";

export default function LiveCourseEnrollCard({ course }: CourseEnrollCardProps) {
  const hasDiscount = course.price_offer && course.price_regular && course.price_offer < course.price_regular;
  const discountPercentage = hasDiscount 
    ? Math.round(((course.price_regular! - course.price_offer!) / course.price_regular!) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Course Image */}
      <div className="relative aspect-video">
        {course.poster && (
          <Image
            src={course.poster}
            alt={course.title}
            fill
            className="object-cover"
          />
        )}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          Live
        </div>
      </div>

      {/* Course Info */}
      <div className="p-6">
        {/* Pricing */}
        <div className="mb-6">
          {hasDiscount ? (
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ${course.price_offer?.toLocaleString('en-US')}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${course.price_regular?.toLocaleString('en-US')}
              </span>
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-900">
              ${course.price_regular?.toLocaleString('en-US') || 'Free'}
            </div>
          )}
        </div>

        {/* Enroll Button */}
        <Link
          href={`#enroll`}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mb-6"
        >
          <span>Enroll Now</span>
        </Link>

        {/* Course Features */}
        <div className="space-y-3 mb-6">
          {course.duration && (
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{course.duration}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Video className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Live Course</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Everyone</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Award className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">With Certificate</span>
          </div>

          {course.starts_on && (
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Start: {new Date(course.starts_on).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>

        {/* What's Included Preview */}
        {course.included && course.included.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Course includes:</h4>
            <div className="space-y-2">
              {course.included.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 line-clamp-1">{item}</span>
                </div>
              ))}
              {course.included.length > 3 && (
                <p className="text-sm text-gray-500">
                  and {course.included.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.8/5</span>
            </div>
            <div>•</div>
              <div>8+ students</div>
          </div>
        </div>
      </div>
    </div>
  );
} 