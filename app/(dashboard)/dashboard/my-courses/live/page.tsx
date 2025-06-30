'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import Link from 'next/link'

type Course = {
  id: string
  title: string
  slug: string
  poster: string
  duration: string
  type: string
}

export default function MyCoursesPage() {
  const supabase = createClientComponentClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
  
      if (!user) {
        setCourses([])
        setLoading(false)
        return
      }
  
      const { data, error } = await supabase
        .from('user_courses')
        .select('course_id, courses ( id, title, slug, poster, duration, type )')
        .eq('user_id', user.id)
  
      if (error) {
        console.error('Error fetching courses:', error.message)
        setCourses([])
      } else {
        // Cast and filter for live only
        const enrolled = data
          .map((entry) => entry.courses as unknown as Course)
          .filter((course) => course.type === 'live')
  
        setCourses(enrolled)
      }
  
      setLoading(false)
    }
  
    fetchCourses()
  }, [])  

  if (loading) return <p className="p-4">লোড হচ্ছে...</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">আমার লাইভ কোর্সসমূহ</h1>

      {courses.length === 0 ? (
        <p>আপনি এখনও কোনো লাইভ কোর্সে এনরোল করেননি।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/my-courses/${course.type.toLowerCase().replace(/ /g, '-')}/${course.slug}`}
              className="rounded-xl p-4 bg-white border border-transparent hover:border-purple-300 shadow-sm hover:shadow-md hover:shadow-purple-200 transition flex flex-col justify-between"
            >
              {course.poster && (
                <Image
                  src={course.poster}
                  alt={course.title}
                  width={300}
                  height={300}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h2 className="mt-2 font-semibold text-lg">{course.title}</h2>
              <div className="flex gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${
                    course.type === "live"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  {course.type.charAt(0).toUpperCase() + course.type.slice(1).toLowerCase()}
                </span>
                <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                  {course.duration}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
