'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Course {
  id: string
  title: string
}

interface CourseVideo {
  id: string
  title: string
  course_id: string
  youtube_url: string
  thumbnail_url?: string
  is_published: boolean
  created_at: string
}

export default function RecordingsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [videos, setVideos] = useState<CourseVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<CourseVideo[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // 🔹 Get enrolled courses
      const { data: userCourses, error: courseErr } = await supabase
        .from('user_courses')
        .select('course_id')
        .eq('user_id', user.id)

      if (courseErr || !userCourses) return

      const courseIds = userCourses.map((uc) => uc.course_id)

      // 🔹 Get course titles
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title')
        .in('id', courseIds)

      setCourses(courseData || [])

      // 🔹 Get published course videos
      const { data: courseVideos, error: videoErr } = await supabase
        .from('course_videos')
        .select('*')
        .in('course_id', courseIds)
        .eq('is_published', true)
        .order('created_at', { ascending: true })

      if (!videoErr && courseVideos) {
        setVideos(courseVideos)
        setFilteredVideos(courseVideos)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleFilterChange = (courseId: string) => {
    setSelectedCourseId(courseId)
    if (!courseId) {
      setFilteredVideos(videos)
    } else {
      setFilteredVideos(videos.filter((video) => video.course_id === courseId))
    }
  }

  if (loading) return <p className="text-gray-500">লোড হচ্ছে...</p>

  if (filteredVideos.length === 0)
    return <p className="text-gray-500">কোনো ভিডিও রেকর্ডিং পাওয়া যায়নি।</p>

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-xl font-bold mb-4">ক্লাস রেকর্ডিংসমূহ</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">কোর্স অনুযায়ী দেখুন:</label>
        <select
          value={selectedCourseId}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg w-full md:w-auto bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">সকল কোর্স</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => router.push(`/dashboard/recordings/${video.id}`)}
            className="bg-white cursor-pointer rounded-xl shadow-sm hover:shadow-md transition"
          >
            <img
              src={
                video.thumbnail_url ||
                `https://img.youtube.com/vi/${getYouTubeId(video.youtube_url)}/mqdefault.jpg`
              }
              alt={video.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-3">
              <p className="font-semibold text-gray-800">{video.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                {courses.find((c) => c.id === video.course_id)?.title || 'অজানা কোর্স'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🧠 Helper: Extract YouTube video ID
function getYouTubeId(url: string) {
  try {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    return match ? match[1] : ''
  } catch {
    return ''
  }
}
