import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Clock, Users, Award, CheckCircle, BookOpen, Target, FileText, Calendar, Video } from "lucide-react";
import LiveCourseEnrollCard from "@/components/courses/live/LiveCourseEnrollCard";
import LiveCourseModules from "@/components/courses/live/LiveCourseModules";
import Image from "next/image";
import LiveCourseEnrollForm from "@/components/courses/live/LiveCourseEnrollForm";

async function getCourse(slug: string) {
  const supabase = createServerComponentClient({ cookies });
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("type", "live")
    .single();
  
  return course;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  
  if (!course) {
    return {
      title: "Course not found",
      description: "The course you are looking for was not found. Please try again later.",
    };
  }

  return {
    title: course.title,
    description: course.description,
    keywords: [
      "Live Course",
      "Course not found",
      "Try again later",
    ],
    metadataBase: new URL('https://insilicology.org'),
    alternates: {
      canonical: `/courses/live/${slug}`,
    },
    openGraph: {
      title: course.title,
      description: course.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
    },
  };
}

export default async function LiveCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch course data
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", (await params).slug)
    .eq("type", "live")
    .single();

  if (!course) return notFound();

  // Fetch modules and lessons for this course
  const { data: modules } = await supabase
    .from("modules")
    .select(`
      id,
      title,
      position,
      description,
      lessons (
        id,
        title,
        position,
        duration_minutes,
        is_live_session,
        live_start_time
      )
    `)
    .eq("course_id", course.id)
    .order("position");

  // Sort lessons within each module
  const sortedModules = modules?.map(module => ({
    ...module,
    lessons: module.lessons?.sort((a, b) => a.position - b.position) || []
  })).sort((a, b) => a.position - b.position) || [];

  // Calculate live sessions count
  const liveSessionsCount = sortedModules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.is_live_session).length, 0
  );

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(240, 238, 233) 1.5px, transparent 1px)",
        backgroundSize: "15px 15px",
      }}
    >
      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-8">

            {/* Title Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>
                <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Course Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                  <Clock className="w-10 h-10 text-purple-600 bg-purple-100 rounded-md p-2" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{course.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                  <Video className="w-10 h-10 text-purple-600 bg-purple-100 rounded-md p-2" />
                  <div>
                    <p className="text-sm text-gray-600">Course Type</p>
                    <p className="font-semibold text-gray-900">Live Course</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                  <Award className="w-10 h-10 text-purple-600 bg-purple-100 rounded-md p-2" />
                  <div>
                    <p className="text-sm text-gray-600">Certificate</p>
                    <p className="font-semibold text-gray-900">Yes, after the course</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                  <Users className="w-10 h-10 text-purple-600 bg-purple-100 rounded-md p-2" />
                  <div>
                    <p className="text-sm text-gray-600">Best for</p>
                    <p className="font-semibold text-gray-900">Everyone</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                  <Target className="w-10 h-10 text-purple-600 bg-purple-100 rounded-md p-2" />
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="font-semibold text-gray-900">{course.difficulty || 'Medium'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                  <BookOpen className="w-10 h-10 text-purple-600 bg-purple-100 rounded-md p-2" />
                  <div>
                    <p className="text-sm text-gray-600">Live Sessions</p>
                    <p className="font-semibold text-gray-900">{liveSessionsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Start Date */}
            {course.starts_on && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Start</h2>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <Calendar className="w-12 h-12 text-purple-600 bg-purple-100 rounded-md p-2" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Date(course.starts_on).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* What You'll Learn */}
            {course.included && course.included.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.included.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{course.requirements}</p>
                </div>
              </div>
            )}

            {/* Course Modules */}
            {sortedModules.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course modules</h2>
                <LiveCourseModules modules={sortedModules} />
              </div>
            )}

            {/* Topics */}
            {course.topics && course.topics.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course topics</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.topics.map((topic: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate */}
            {course.certificate && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate</h2>
                <div className="flex justify-center rounded-sm border-2 border-gray-300 overflow-hidden">
                  <Image src="/certificates/wordpress-cert.png" alt="Certificate" width={600} height={300} className="rounded-sm" />
                </div>
              </div>
            )}

            {/* FAQs */}
            {course.faqs && course.faqs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs</h2>
                <div className="space-y-4">
                  {course.faqs.map((faq: { question: string; answer: string }, index: number) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* Enroll Card - inline */}
          <div>
            <LiveCourseEnrollCard course={course} />
          </div>

          {/* Embedded Enrollment Form */}
          <LiveCourseEnrollForm
            courseId={course.id}
            slug={course.slug}
            priceRegular={course.price_regular}
            priceOffer={course.price_offer}
          />
        </div>
      </div>
    </div>
  );
} 