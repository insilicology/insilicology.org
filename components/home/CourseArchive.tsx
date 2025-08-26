
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Zap, BookOpen, Clock, Users, Star, Tag } from "lucide-react";

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
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 hover:border-purple-300"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={course.poster}
                    alt={course.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Course Type Badge */}
                  <div className="absolute top-3 left-3">
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
                          {course.price_offer ? `৳${course.price_offer}` : "Free"}
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

                  {/* Decorative Elements */}
                  <div className="absolute top-3 right-12 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 relative">
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {course.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors leading-relaxed">
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
                          ৳{course.price_offer}
                        </span>
                        {parseInt(course.price_regular) > parseInt(course.price_offer) && (
                          <span className="text-sm text-gray-500 line-through">
                            ৳{course.price_regular}
                          </span>
                        )}
                        {parseInt(course.price_regular) > parseInt(course.price_offer) && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Save ৳{parseInt(course.price_regular) - parseInt(course.price_offer)}
                          </span>
                        )}
                      </div>
                    )}
                    {!course.price_offer && course.price_regular && (
                      <span className="text-2xl font-bold text-gray-900">
                        ৳{course.price_regular}
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
