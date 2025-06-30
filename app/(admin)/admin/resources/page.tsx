'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from 'react-hot-toast';

type Resource = {
  id: string;
  title: string;
  file_url: string;
  course_id: string | null;
  course_title: string;
};

type ResourceWithCourse = {
  id: string;
  title: string;
  file_url: string;
  course_id: string | null;
  courses: {
    title: string;
  } | null;
};

export default function AdminResourcesListPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, file_url, course_id, courses(title)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('রিসোর্স লোড করতে সমস্যা:', error.message);
        toast.error('রিসোর্স লোড করতে সমস্যা হয়েছে!');
      } else {
        const parsed = (data as unknown as ResourceWithCourse[]).map((r) => ({
          id: r.id,
          title: r.title,
          file_url: r.file_url,
          course_id: r.course_id,
          course_title: r.courses?.title || 'অজানা কোর্স',
        }));
        setResources(parsed);
      }

      setLoading(false);
    };

    fetchResources();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎓 রিসোর্স তালিকা</h1>
        <button onClick={() => router.push('/admin/resources/new')} className="bg-black cursor-pointer text-white px-4 py-2 rounded hover:bg-gray-800 transition">রিসোর্স যোগ করুন</button>
      </div>
      <Toaster position="top-center" />

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : resources.length === 0 ? (
        <p>🙁 কোনো রিসোর্স পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-4 border-b">টাইটেল</th>
                <th className="py-2 px-4 border-b">কোর্স</th>
                <th className="py-2 px-4 border-b text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border-b font-medium">
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {r.title}
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b text-gray-700">{r.course_title}</td>
                  <td className="py-2 px-4 border-b text-right">
                    <button
                      onClick={() => router.push(`/admin/resources/${r.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      এডিট
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
