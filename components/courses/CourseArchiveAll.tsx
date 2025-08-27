
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Clock, Users, Star, Tag } from "lucide-react";

export const metadata = {
  title: "All Courses",
  description:
    "Browse all courses offered by Skilltori, including live and recorded sessions designed to boost your skills.",
};

export default async function CourseArchiveAll() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !courses || courses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">All Courses</h1>
        <p className="text-gray-600">No courses found. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.type.toLowerCase()}/${course.slug}`}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
          >
            {/* Image Section */}
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={course.poster}
                alt={course.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className={`text-xs px-3 py-1.5 rounded-full text-white font-semibold shadow-lg ${
                    course.type === "live" 
                      ? "bg-gradient-to-r from-red-500 to-pink-500" 
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  }`}
                >
                  {course.type === "live" ? "Live" : "Recorded"}
                </span>
              </div>

              {/* Price Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-purple-600" />
                    <span className="text-xs font-bold text-gray-900">
                      {course.price_offer ? `$${course.price_offer}` : "Free"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 left-3">
                <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">
                      {course.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                {course.title}
              </h2>
              
              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                {course.description}
              </p>

              {/* Course Details */}
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>Unlimited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-4">
                {course.price_offer && course.price_regular && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">
                      ${course.price_offer}
                    </span>
                    {parseInt(course.price_regular) > parseInt(course.price_offer) && (
                      <span className="text-sm text-gray-500 line-through">
                        ${course.price_regular}
                      </span>
                    )}
                    {parseInt(course.price_regular) > parseInt(course.price_offer) && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Save ${parseInt(course.price_regular) - parseInt(course.price_offer)}
                      </span>
                    )}
                  </div>
                )}
                {!course.price_offer && course.price_regular && (
                  <span className="text-2xl font-bold text-gray-900">
                    ${course.price_regular}
                  </span>
                )}
                {!course.price_offer && !course.price_regular && (
                  <span className="text-lg font-bold text-green-600">
                    Free
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-semibold text-sm group-hover:text-purple-700 transition-colors">
                  View Details
                </span>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
