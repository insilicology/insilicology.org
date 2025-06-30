import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Video, Clock, Users } from "lucide-react";

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

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.type.toLowerCase()}/${course.slug}`}
            className="group relative bg-white rounded-xl overflow-hidden shadow-lg shadow-red-100 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Course Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={course.poster}
                alt={course.title}
                fill
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              {/* Live Badge */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-xs px-3 py-1 rounded-full text-white font-medium shadow-sm bg-red-600 border border-red-500">
                  লাইভ
                </span>
                {course.duration && (
                  <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                    {course.duration}
                  </span>
                )}
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>

              {/* Course Features */}
              <div className="space-y-2 mb-4">
                {course.duration && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center text-xs text-gray-500">
                  <Video className="w-3 h-3 mr-2" />
                  <span>Live Session</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="w-3 h-3 mr-2" />
                  <span>All</span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-red-600 font-semibold text-sm">Learn more</span>
                <ArrowRight size={16} className="text-red-600 group-hover:translate-x-1 transition-transform duration-200" />
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
