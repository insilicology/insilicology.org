'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminUserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    district: '',
    whatsapp: '',
    role: 'student', // default role
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error(error || 'User not found');
        return;
      }

      setForm({
        name: data.name || '',
        email: data.email || '',
        gender: data.gender || '',
        district: data.district || '',
        whatsapp: data.whatsapp || '',
        role: data.role || 'student',
      });

      setLoading(false);
    };

    fetchUser();
  }, []);

  const updateUser = async () => {
    const { error } = await supabase
      .from('users')
      .update({
        ...form,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      alert('🛑 ইউজার আপডেট ব্যর্থ হয়েছে');
      console.error(error);
    } else {
      alert('✅ ইউজার সফলভাবে আপডেট হয়েছে');
      router.push('/admin/users');
    }
  };

  const inputStyle =
    'w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">ইউজার তথ্য সম্পাদনা করুন</h1>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : (
        <div className="space-y-5">
          {[
            { label: 'নাম', key: 'name' },
            { label: 'ইমেইল', key: 'email' },
            { label: 'লিঙ্গ', key: 'gender' },
            { label: 'জেলা', key: 'district' },
            { label: 'WhatsApp', key: 'whatsapp' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputStyle}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">রোল</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputStyle}
            >
              <option value="student">👨‍🎓 Student</option>
              <option value="admin">🛡️ Admin</option>
            </select>
          </div>

          <button
            onClick={updateUser}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            আপডেট করুন
          </button>
        </div>
      )}
    </div>
  );
}
