'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type ResourceItem = {
  id: string;
  title: string;
  file_url: string;
  course_id: string;
  course_title: string;
};

type ResourceWithCourse = {
  id: string;
  title: string;
  file_url: string;
  course_id: string;
  courses: {
    title: string;
  } | null;
};

export default function StudentResourcesPage() {
  const supabase = createClientComponentClient();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) return setLoading(false);

      // Get enrolled course IDs
      const { data: enrolled, error: enrollError } = await supabase
        .from('user_courses')
        .select('course_id')
        .eq('user_id', user.id);
      if (enrollError) {
        console.error('Enrolled fetch error', enrollError.message);
        return setLoading(false);
      }

      const courseIds = enrolled?.map((e) => e.course_id) || [];
      if (courseIds.length === 0) {
        setResources([]);
        return setLoading(false);
      }

      // Fetch linked resources
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, file_url, course_id, courses(title)')
        .in('course_id', courseIds);

      if (error) {
        console.error('Resources fetch error', error.message);
      } else {
        setResources(
          ((data as unknown) as ResourceWithCourse[]).map((r) => ({
            id: r.id,
            title: r.title,
            file_url: r.file_url,
            course_id: r.course_id,
            course_title: r.courses?.title ?? 'Unknown Course',
          }))
        );
      }

      setLoading(false);
    };

    loadResources();
  }, []);

  if (loading) {
    return <p className="p-6">লোড হচ্ছে...</p>;
  }

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-xl font-bold mb-4">রিসোর্সসমূহ</h1>

      <div className="grid grid-cols-1 gap-2">
      {resources.length === 0 ? (
        <p>দুঃখিত, আপনি কোনো রিসোর্সে এক্সেস করছেন না বা এগুলো এই মুহূর্তে উপলব্ধ নয়।</p>
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li key={r.id} className="flex items-center justify-between bg-white shadow-sm rounded-lg p-2 border border-white hover:border-purple-300">
              <div className='flex items-center gap-2 justify-between w-full'>
                <div>
                  <Link href={r.file_url} target="_blank" className="text-blue-600 hover:underline font-medium">
                    {r.title}
                  </Link>
                  <p className="text-sm text-gray-500">কোর্স: {r.course_title}</p>
                </div>
                <button onClick={() => window.open(r.file_url, '_blank')} className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-4 py-2 rounded-md">Download</button>
              </div>
            </li>
          ))}
          </ul>
        )}
      </div>
    </div>
  );
}
