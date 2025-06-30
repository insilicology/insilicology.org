'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
}

interface Resource {
  id: string;
  course_id: string;
  title: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

interface ResourceForm {
  course_id: string;
  title: string;
  file_url: string;
}

export default function AdminResourcesPage() {
  const supabase = createClientComponentClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState<ResourceForm>({
    course_id: '',
    title: '',
    file_url: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const [c, r] = await Promise.all([
        supabase.from('courses').select('id, title'),
        supabase.from('resources').select('*').order('created_at', { ascending: false }),
      ]);

      setCourses(c.data || []);
      setResources(r.data || []);
    };

    loadData();
  }, []);

  const addResource = async () => {
    const { error } = await supabase.from('resources').insert({
      ...form,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error('রিসোর্স যোগ করতে সমস্যা হয়েছে!');
      console.error(error);
    } else {
      toast.success('রিসোর্স সফলভাবে যোগ হয়েছে!');
      setForm({ course_id: '', title: '', file_url: '' });

      const { data: updated } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      setResources(updated || []);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">রিসোর্স যোগ করুন</h1>
      <Toaster position="top-center" />

      <div className="space-y-4 bg-white p-4 rounded shadow">
        {[
          { label: 'টাইটেল', key: 'title' },
          { label: 'ফাইল লিংক', key: 'file_url' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type="text"
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">কোর্স</label>
          <select
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- নির্বাচন করুন --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={addResource}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          রিসোর্স সংরক্ষণ করুন
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-4">📦 সংরক্ষিত রিসোর্স সমূহ</h2>
      <ul className="space-y-3">
        {resources.map((r) => (
          <li key={r.id} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded shadow-sm">
            <span>{r.title}</span>
            <a
              href={r.file_url}
              download
              target="_blank"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              ডাউনলোড
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
