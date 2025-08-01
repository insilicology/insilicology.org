
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Zap, BookOpen } from "lucide-react";

export const metadata = {
  title: "All Courses",
  description:
    "Browse all courses offered by Skilltori, including live and recorded sessions designed to boost your skills.",
};

export default async function CourseArchive() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !courses || courses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">All Courses</h1>
        <p className="text-gray-600">কোনো কোর্স পাওয়া যায়নি। পরে আবার চেষ্টা করুন।</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg mb-6">
            <BookOpen className="w-4 h-4" />
            Our Courses
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              আমাদের কোর্সসমূহ
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore our comprehensive collection of live and recorded courses designed to enhance your skills.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.type.toLowerCase()}/${course.slug}`}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 hover:border-transparent"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={course.poster}
                    alt={course.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full text-white font-medium shadow-lg ${
                        course.type === "live" 
                          ? "bg-gradient-to-r from-red-500 to-pink-500" 
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                    >
                      {course.type.charAt(0).toUpperCase() + course.type.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs bg-gradient-to-r from-gray-700 to-gray-800 text-white px-3 py-1 rounded-full font-medium shadow-lg">
                      {course.duration}
                    </span>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-6 relative">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-600 font-semibold text-sm group-hover:text-purple-700 transition-colors">
                      আরও জানুন
                    </span>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h3>
              <p className="text-white/90 mb-8 text-lg">
                Join our community of learners and take your skills to the next level with our expert-led courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/courses"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Browse All Courses
                  <Zap className="w-5 h-5" />
                </a>
                <a 
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
