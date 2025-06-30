'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Lock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  type: string;
  duration: string;
  price_offer: string;
  price_regular: string;
  poster: string;
  description: string;
  starts_on: string;
  is_published: boolean;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        // Redirect to enroll page if not logged in
        router.push(`/courses/${params.slug}/enroll`);
        return;
      }

      setUser(session.user);

      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error || !courseData) {
        toast.error('কোর্স পাওয়া যায়নি।');
        router.push('/');
        return;
      }

      setCourse(courseData);
      setLoading(false);
    }

    loadData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          // Redirect to enroll page if user logs out
          router.push(`/courses/${params.slug}/enroll`);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [params.slug, router, supabase.auth]);

  const startPayment = async () => {
    if (!user) {
      toast.error('পেমেন্ট করার জন্য লগইন করুন');
      return;
    }

    if (!course) {
      toast.error('কোর্স তথ্য পাওয়া যায়নি');
      return;
    }

    setPaying(true);

    try {
      console.log('Starting bKash payment with:', {
        user_id: user.id,
        course_id: course.id,
        amount: Number(course.price_offer),
        email: user.email,
        name: user.user_metadata?.display_name || user.email,
      });

      const { data } = await axios.post('/api/bkash/make-payment', {
        user_id: user.id,
        course_id: course.id,
        amount: Number(course.price_offer),
        email: user.email,
        name: user.user_metadata?.display_name || user.email,
        phone: '', // Empty phone - bKash will handle phone input
      });

      console.log('bKash payment response:', data);

      // Check for successful response and redirect URL
      if (data?.statusCode === 200 && data?.url) {
        console.log('Redirecting to bKash URL:', data.url);
        // Redirect to bKash payment page
        window.location.href = data.url;
      } else if (data?.statusCode === 200 && data?.data?.bkashURL) {
        console.log('Redirecting to bKash URL (fallback):', data.data.bkashURL);
        // Fallback to check data.bkashURL
        window.location.href = data.data.bkashURL;
      } else {
        console.error('bKash payment failed:', data);
        toast.error(data?.statusMessage || data?.error || 'পেমেন্ট শুরু করা যায়নি');
      }
    } catch (error) {
      console.error('bKash payment exception:', error);
      toast.error('পেমেন্ট শুরু করা যায়নি');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-center">লোড হচ্ছে...</p>;
  }

  return (
    <section 
      className="flex flex-col items-center w-full md:w-auto mx-auto pt-12 md:pt-14 pb-20 md:pb-22 px-3 gap-2"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(240, 238, 233) 1.5px, transparent 1px)",
        backgroundSize: "15px 15px",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-purple-600">পেমেন্ট করুন</h1>
      </div>
      <div className="w-full bg-white md:max-w-xl mx-auto p-6 border border-gray-200 rounded-2xl shadow-sm my-8">
        <div className="flex items-center gap-2 mb-4">
          <img src={course?.poster} alt={course?.title} className="w-16 h-16 rounded-lg" />
          <div className="flex flex-col flex-1 gap-2">
            <h2 className="text-lg md:text-2xl font-bold">{course?.title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mb-2 rounded-full px-3 py-1 bg-red-500 text-white">{course?.type.toUpperCase()}</span>
              <span className="text-xs text-gray-500 mb-2 rounded-full px-3 py-1 bg-gray-800 text-white">{course?.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between border-y border-gray-200 py-4">
          <span className="font-semibold">কোর্স ফি:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400 line-through">৳{Number(course?.price_regular).toLocaleString('bn-BD')}</span>
            <span className="font-bold text-lg md:text-xl">৳{Number(course?.price_offer).toLocaleString('bn-BD')}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-100 border-l-4 border-green-400 text-green-700">
            <p className="font-medium">✅ আপনি সফলভাবে লগইন করেছেন</p>
            <p className="text-sm mt-1">এখন পেমেন্ট করে কোর্সে এনরোল করুন</p>
          </div>

          <button
            onClick={startPayment}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 cursor-pointer font-medium"
            disabled={paying}
          >
            {paying ? 'প্রসেসিং হচ্ছে...' : (
              <>
                <img src="/logos/logo-bkash-round.svg" alt="bKash" className="w-6 h-6 inline-block mr-2 rounded-full" /> 
                bKash দিয়ে পেমেন্ট করুন
              </>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push(`/courses/${params.slug}/enroll`)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← ফিরে যান
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-2">
        <span className="text-xs text-green-500 flex">
          <Lock className="w-3 h-3 inline-block mr-2" />
          সিকিউরড পেমেন্ট
        </span>
      </div>
      <div className="p-4 w-full md:max-w-xl bg-blue-50 border-l-4 border-blue-400 text-blue-700 rounded-lg mx-auto">
        <p className="text-sm text-center">
          💡 bKash পেমেন্টে অসুবিধা হলে আমাদের সাথে যোগাযোগ করুন{' '}
          <b>
            <a href="https://wa.me/8801842221872" className="text-purple-600 hover:underline">
              ০১৮৪২২২১৮৭২
            </a>
          </b>{' '}
          নম্বরে।
        </p>
      </div>
    </section>
  );
} 