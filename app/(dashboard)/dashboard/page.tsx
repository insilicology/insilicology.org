"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  BookOpen,
  Video,
  FileText,
  CreditCard,
  MessageCircle,
  User,
  Calendar,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  gender: string | null;
  country: string | null;
  whatsapp: string | null;
  facebook: string | null;
  telegram: string | null;
  role: string;
};

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0
  });

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            toast.error("Authentication error");
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError && !userError.message.includes('infinite recursion')) {
            console.error('User data fetch error:', userError);
            if (mounted) {
              toast.error("User data fetch failed");
              setLoading(false);
            }
            return;
          }

          // Use fallback user data if RLS error
          if (userError && userError.message.includes('infinite recursion')) {
            const fallbackUser: PublicUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
              gender: null,
              country: null,
              whatsapp: null,
              facebook: null,
              telegram: null,
              role: 'user'
            };
            if (mounted) setUser(fallbackUser);
          } else if (userData) {
            if (mounted) setUser(userData);
          }

          // Fetch user courses and calculate stats
          const { data: userCourses, error: coursesError } = await supabase
            .from('user_courses')
            .select('*')
            .eq('user_id', session.user.id);

          if (!coursesError && userCourses) {
            const totalCourses = userCourses.length;
            const completedCourses = userCourses.filter(course => course.status === 'completed').length;
            const totalHours = userCourses.reduce((sum, course) => sum + (course.hours_watched || 0), 0);
            const certificates = userCourses.filter(course => course.certificate_issued).length;

            if (mounted) {
              setStats({
                totalCourses,
                completedCourses,
                totalHours,
                certificates
              });
            }
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        if (mounted) {
          toast.error("Failed to load dashboard data");
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔐</div>
          <p className="text-gray-600 mb-2 text-lg font-medium">Please log in</p>
          <p className="text-sm text-gray-500 mb-6">Login to access your dashboard</p>
          <a 
            href="/login" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors shadow-sm"
          >
            Login Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user.name || 'Learner'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completedCourses}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hours Watched</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalHours}h</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates</p>
              <p className="text-2xl font-bold text-gray-800">{stats.certificates}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/dashboard/my-courses"
              className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-gray-700">My Courses</span>
            </Link>
            
            <Link 
              href="/dashboard/recordings"
              className="flex items-center gap-3 p-4 bg-gray-50 border border-blue-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Video className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Recordings</span>
            </Link>
            
            <Link 
              href="/dashboard/resources"
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">Resources</span>
            </Link>
            
            <Link 
              href="/dashboard/support"
              className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-gray-700">Support</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-amber-100 rounded-lg">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Course Progress</p>
                <p className="text-sm text-gray-500">You're making great progress!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Achievement Unlocked</p>
                <p className="text-sm text-gray-500">Keep up the excellent work!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Learning Streak</p>
                <p className="text-sm text-gray-500">3 days in a row!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <User className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{user.name || 'Not set'}</p>
              <p className="text-sm text-gray-500">Full Name</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{user.country || 'Not set'}</p>
              <p className="text-sm text-gray-500">Country</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-700">Active</p>
              <p className="text-sm text-gray-500">Subscription</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
