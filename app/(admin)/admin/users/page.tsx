'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface User {
  id: string;
  name: string;
  email: string;
  district?: string;
}

export default function UsersPage() {
  const supabase = createClientComponentClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) console.error(error);
      else setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ইউজার লিস্ট</h1>
        <Link href="/admin/users/new" className="bg-blue-600 text-white px-4 py-2 rounded">নতুন ইউজার</Link>
      </div>

      {loading ? <p>লোড হচ্ছে...</p> : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">নাম</th>
              <th className="p-2 border">ইমেইল</th>
              <th className="p-2 border">জেলা</th>
              <th className="p-2 border">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.district || '-'}</td>
                <td className="p-2 border">
                  <Link href={`/admin/users/${u.id}`} className="text-blue-600">ডিটেইলস</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
