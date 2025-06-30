'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Course {
  id: string
  title: string
}

export default function EditVideoPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [courses, setCourses] = useState<Course[]>([])
  const [courseId, setCourseId] = useState('')
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: coursesData }, { data: videoData }] = await Promise.all([
        supabase.from('courses').select('id, title'),
        supabase.from('course_videos').select('*').eq('id', id).single(),
      ])
      if (coursesData) setCourses(coursesData)
      if (videoData) {
        setCourseId(videoData.course_id)
        setTitle(videoData.title)
        setYoutubeUrl(videoData.youtube_url)
        setIsPublished(videoData.is_published)
      }
    }

    fetchData()
  }, [id])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('course_videos')
      .update({
        course_id: courseId,
        title,
        youtube_url: youtubeUrl,
        is_published: isPublished,
      })
      .eq('id', id)

    setLoading(false)

    if (error) {
      alert('Error updating video: ' + error.message)
    } else {
      router.push('/admin/recordings')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই ভিডিওটি মুছে ফেলতে চান?')) return

    setDeleting(true)
    setError(null)

    const { error } = await supabase.from('course_videos').delete().eq('id', id)

    if (error) {
      setError('ভিডিও মুছে ফেলা যায়নি। আবার চেষ্টা করুন।')
      setDeleting(false)
    } else {
      router.push('/admin/recordings')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">🎥 ভিডিও সম্পাদনা করুন</h1>
      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium">কোর্স</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">একটি কোর্স বেছে নিন</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">ভিডিও টপিক (Title)</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">YouTube লিংক</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <label>পাবলিশড</label>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          disabled={loading || deleting}
        >
          {loading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          disabled={deleting || loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          {deleting ? 'মুছে ফেলা হচ্ছে...' : 'ভিডিও ডিলিট করুন'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}
