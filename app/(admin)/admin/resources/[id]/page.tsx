'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Resource = {
  id: string;
  title: string;
  file_url: string;
  course_id: string | null;
};

export default function AdminResourceEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState<boolean>(true);
  const [resource, setResource] = useState<Resource | null>(null);

  const [form, setForm] = useState({
    title: '',
    file_url: '',
    course_id: '',
  });

  useEffect(() => {
    const fetchResource = async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('রিসোর্স লোড করতে সমস্যা:', error.message);
      } else if (data) {
        setResource(data);
        setForm({
          title: data.title || '',
          file_url: data.file_url || '',
          course_id: data.course_id || '',
        });
      }

      setLoading(false);
    };

    fetchResource();
  }, [id]);

  const updateResource = async () => {
    const { error } = await supabase
      .from('resources')
      .update({
        title: form.title,
        file_url: form.file_url,
        course_id: form.course_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      alert('আপডেট ব্যর্থ হয়েছে');
      console.error(error.message);
    } else {
      alert('✅ সফলভাবে হালনাগাদ হয়েছে');
      router.push('/admin/resources');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎯 রিসোর্স এডিট করুন</h1>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : !resource ? (
        <p>রিসোর্স পাওয়া যায়নি।</p>
      ) : (
        <div className="space-y-4">
          {[
            { label: 'টাইটেল', key: 'title' },
            { label: 'ফাইল URL', key: 'file_url' },
            { label: 'কোর্স আইডি', key: 'course_id' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block font-medium text-sm text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            onClick={updateResource}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      )}
    </div>
  );
}
