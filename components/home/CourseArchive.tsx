
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">আমাদের কোর্সসমূহ</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.type.toLowerCase()}/${course.slug}`}
            className="group relative bg-white rounded-xl overflow-hidden shadow-lg shadow-purple-200 hover:shadow-xl transition"
          >
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={course.poster}
                alt={course.title}
                fill
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded text-white font-medium shadow-sm ${
                    course.type === "live" ? "bg-red-600" : "bg-blue-600"
                  }`}
                >
                  {course.type.charAt(0).toUpperCase() + course.type.slice(1).toLowerCase()}
                </span>
                <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded font-medium shadow-sm">
                  {course.duration}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-semibold text-sm">আরও জানুন</span>
                <ArrowRight size={16} className="text-purple-600 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
