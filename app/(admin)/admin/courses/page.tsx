"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  slug: string;
  type: string;
  poster: string | null;
  price_regular: number | null;
  price_offer: number | null;
  is_published: boolean;
  starts_on: string | null;
}

export default function CoursesListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, slug, type, poster, price_regular, price_offer, is_published, starts_on")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error.message);
      } else {
        console.log("Fetched courses:", data);
        setCourses(data as Course[]);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", e.currentTarget.src);
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextElementSibling?.classList.remove('hidden');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🎓 কোর্স তালিকা</h1>
        <Link href="/admin/courses/new">
          <Button>+ নতুন কোর্স</Button>
        </Link>
      </div>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">কোনো কোর্স পাওয়া যায়নি।</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg shadow hover:shadow-md transition bg-white overflow-hidden"
            >
              <div className="relative w-full h-48">
                {course.poster ? (
                  <>
                    <img
                      src={course.poster}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={handleImageError}
                    />
                    <div className="hidden w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      Image failed to load
                    </div>
                  </>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-600 capitalize">ধরন: {course.type}</p>
                {course.starts_on && (
                  <p className="text-sm text-gray-500">শুরু: {new Date(course.starts_on).toLocaleDateString("bn-BD")}</p>
                )}
                <div className="text-sm">
                  <span className="line-through text-gray-400 mr-2">
                    ${course.price_regular ?? "N/A"}
                  </span>
                  <span className="text-green-600 font-bold">
                    ${course.price_offer ?? course.price_regular ?? "N/A"}
                  </span>
                </div>
                <p className={`text-xs font-medium ${course.is_published ? "text-green-600" : "text-red-500"}`}>
                  {course.is_published ? "✅ প্রকাশিত" : "⏳ অপ্রকাশিত"}
                </p>
                <Link
                  href={`/admin/courses/${course.slug}`}
                  className="inline-block mt-2 text-purple-600 hover:underline text-sm font-medium"
                >
                  বিস্তারিত দেখুন →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
