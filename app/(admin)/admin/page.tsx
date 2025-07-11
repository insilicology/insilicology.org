'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  ShieldEllipsis,
  BookOpen,
  FileVideo,
  ClipboardList,
  Users,
  LayoutDashboard,
  FileText,
} from 'lucide-react';

const adminMenu = [
  {
    name: 'অ্যাডমিন প্যানেল',
    href: '/admin',
    icon: <ShieldEllipsis size={28} className="text-orange-600" />,
    short: 'নিয়ন্ত্রণ ও পরিদর্শন',
  },
  {
    name: 'কোর্স ম্যানেজমেন্ট',
    href: '/admin/courses',
    icon: <BookOpen size={28} className="text-orange-600" />,
    short: 'কোর্স তৈরি ও আপডেট',
  },
  {
    name: 'ভিডিও ও রিসোর্স',
    href: '/admin/resources',
    icon: <FileVideo size={28} className="text-orange-600" />,
    short: 'রিসোর্স আপলোড ও ম্যানেজ',
  },
  {
    name: 'DFT Submissions',
    href: '/admin/dft-submissions',
    icon: <FileText size={28} className="text-orange-600" />,
    short: 'DFT কোর্স রেজিস্ট্রেশন',
  },
  {
    name: 'পরীক্ষা',
    href: '/admin/exams',
    icon: <ClipboardList size={28} className="text-orange-600" />,
    short: 'পরীক্ষার তালিকা ও ম্যানেজমেন্ট',
  },
  {
    name: 'ইউজার ম্যানেজমেন্ট',
    href: '/admin/users',
    icon: <Users size={28} className="text-orange-600" />,
    short: 'ইউজার তথ্য ও রোল নিয়ন্ত্রণ',
  },
  {
    name: 'স্টুডেন্ট ড্যাশবোর্ড',
    href: '/dashboard',
    icon: <LayoutDashboard size={28} className="text-orange-600" />,
    short: 'স্টুডেন্ট ভিউ দেখতে এখানে যান',
  },
];

export default function AdminDashboardPage() {
  const supabase = createClientComponentClient();
  const [adminName, setAdminName] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalDFTSubmissions: 0,
    recentSubmissions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch admin info
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', user.id)
            .single();

          if (!error) {
            const display = data.name?.trim() || data.email?.split('@')[0] || 'অ্যাডমিন';
            setAdminName(display);
          }
        }

        // Fetch statistics
        const [usersCount, coursesCount, dftCount, recentDFT] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('courses').select('id', { count: 'exact', head: true }),
          supabase.from('dft_reg').select('id', { count: 'exact', head: true }),
          supabase.from('dft_reg')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        setStats({
          totalUsers: usersCount.count || 0,
          totalCourses: coursesCount.count || 0,
          totalDFTSubmissions: dftCount.count || 0,
          recentSubmissions: recentDFT.count || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        স্বাগতম{adminName ? `, ${adminName}` : ''}! 🛠️
      </h1>

      {/* Statistics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="bg-green-100 rounded-full p-2">
                <BookOpen size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DFT Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDFTSubmissions}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-2">
                <FileText size={20} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentSubmissions}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-2">
                <FileText size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminMenu.map((item, idx) => (
          <Link href={item.href} key={idx}>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:shadow-orange-200 p-5 transition-all duration-300 group border border-white hover:border-orange-300">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 rounded-full p-2 group-hover:bg-orange-200">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold group-hover:text-orange-600">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.short}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
