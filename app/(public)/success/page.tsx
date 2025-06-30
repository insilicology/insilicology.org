import Link from 'next/link';
import { CheckCircle, Home, BookOpen, User } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: "Payment Success - Skilltori",
    description: "Your payment has been processed successfully. Welcome to your learning journey!",
    keywords: [
      "Payment Success",
      "Course Enrollment",
      "Learning Platform",
      "Skilltori",
    ],
    metadataBase: new URL('https://skilltori.com'),
    alternates: {
      canonical: '/success',
    },
    openGraph: {
      title: "Payment Success - Skilltori",
      description: "Your payment has been processed successfully. Welcome to your learning journey!",
    },
    twitter: {
      card: 'summary_large_image',
      title: "Payment Success - Skilltori",
      description: "Your payment has been processed successfully. Welcome to your learning journey!",
    },
    robots: {
      index: false,
      follow: true
    },
  };
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            পেমেন্ট সফল হয়েছে!
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            আপনার কোর্স সফলভাবে যুক্ত করা হয়েছে এবং আপনি এখন শুরু করতে পারেন।
          </p>

          {/* Confirmation Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-sm font-medium text-green-700">পেমেন্ট সফল হয়েছে!</span>
            </div>
            <p className="text-sm text-gray-600">
              আপনি এখন শুরু করতে পারেন।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/dashboard/my-courses"
              className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              আমার কোর্সগুলো
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                <User className="w-4 h-4 mr-2" />
                ড্যাশবোর্ড
              </Link>
              
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                হোম
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              সাপোর্ট প্রয়োজন? আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন{' '}
              <Link href="https://wa.me/8801842221872" className="text-green-600 hover:text-green-700 font-medium">
                <b>০১৮৪২২২১৮৭২</b>
              </Link>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="fixed bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
}