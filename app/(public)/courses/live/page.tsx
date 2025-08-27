import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Video, Clock, Users, Star, Tag } from "lucide-react";

export async function generateMetadata() {
  return {
    title: "Live Courses",
    description: "Live courses are available here. Try again later.",
    keywords: [
      "Live Courses",
    ],
    metadataBase: new URL('https://insilicology.org'),
    alternates: {
      canonical: '/courses/live',
    },
    openGraph: {
      title: "Live Courses",
      description: "Live courses are available here. Try again later.",
    },
    twitter: {
      card: 'summary_large_image',
      title: "Live Courses",
      description: "Live courses are available here. Try again later.",
    },
  };
}

export default async function AllCoursesPage() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("type", "live")
    .order("created_at", { ascending: false });

  if (error || !courses || courses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Live Courses</h1>
          <p className="text-gray-600 text-lg">No live courses found. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Video className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Live Courses</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn directly with our experts and ask questions
        </p>
      </div>

      {/* Course List - 3 Columns on Medium+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.type.toLowerCase()}/${course.slug}`}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200"
          >
            {/* Course Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={course.poster}
                alt={course.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Live Badge */}
              <div className="absolute top-3 left-3">
                <span className="text-xs px-3 py-1.5 rounded-full text-white font-semibold shadow-lg bg-gradient-to-r from-red-500 to-pink-500">
                  Live
                </span>
              </div>

              {/* Price Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-red-600" />
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

            {/* Course Content */}
            <div className="p-6">
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                {course.title}
              </h2>
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {course.description}
              </p>

              {/* Course Details */}
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>All Levels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.8</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4" />
                  <span>Live Session</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-4">
                {course.price_offer && course.price_regular && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">
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

              {/* CTA Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-red-600 font-semibold text-sm group-hover:text-red-700 transition-colors">
                  View Details
                </span>
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border border-red-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Looking for more courses?</h3>
          <p className="text-gray-600 mb-6">Check out our recorded courses</p>
          <Link
            href="/courses/recorded"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200"
          >
            Recorded Courses
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
