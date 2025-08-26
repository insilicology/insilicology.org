import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Clock, Users, Award, CheckCircle, BookOpen, Target, FileText, Calendar, Video, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import LiveCourseModules from "@/components/courses/live/LiveCourseModules";
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

  // Live sessions count (remove if not needed)

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

            {/* Header Section with smaller banner and placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative w-full h-40 md:h-56 bg-gray-100">
                {course.poster ? (
                  <img
                    src={course.poster}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Banner unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {course.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.duration && (
                    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border">
                      <Clock className="w-3 h-3 mr-1.5" /> {course.duration}
                    </span>
                  )}
                  {course.starts_on && (
                    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      {new Date(course.starts_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  {course.language && (
                    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border">
                      <BookOpen className="w-3 h-3 mr-1.5" /> {course.language}
                    </span>
                  )}
                  {course.seats && (
                    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border">
                      <Users className="w-3 h-3 mr-1.5" /> {course.seats}
                    </span>
                  )}
                  <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    <Video className="w-3 h-3 mr-1.5" /> Live
                  </span>
                </div>
              </div>
            </div>

            {/* Modern Course Details (like /enroll/dft) */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {course.title}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600">Live Course</p>
                  </div>
                </div>
                <Link
                  href="#enroll"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Sparkles size={16} />
                  Register Now
                </Link>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
                <div className="space-y-3">
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span><span className="font-semibold">Duration:</span> {course.duration}</span>
                    </div>
                  )}
                  {course.dates && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span><span className="font-semibold">Dates:</span> {course.dates}</span>
                    </div>
                  )}
                  {course.time_set && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span><span className="font-semibold">Time:</span> {String(course.time_set).slice(0,5)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span><span className="font-semibold">Platform:</span> Zoom / Google Meet</span>
                  </div>
                  {course.language && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span><span className="font-semibold">Language:</span> {course.language}</span>
                    </div>
                  )}
                  {course.seats && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-pink-500" />
                      <span><span className="font-semibold">Seats:</span> {course.seats}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Roadmap */}
              {course.roadmap && course.roadmap.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Course Roadmap</h3>
                      <p className="text-sm text-gray-600">From basics to advanced</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(course.roadmap as string[]).map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why Join */}
              {course.why_join && course.why_join.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Why join this course?</h3>
                      <p className="text-sm text-gray-600">Discover the benefits</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(course.why_join as string[]).map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-green-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Register CTA */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Ready to Get Started?</h3>
                    <p className="text-sm text-gray-600">Secure your seat now</p>
                  </div>
                </div>
                <Link
                  href="#enroll"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  Register Now
                </Link>
              </div>

              {/* Contact snippets */}
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <div className="font-semibold mb-2 text-gray-800">Registration</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>📝 Register now: Scan QR in poster or DM us directly</p>
                  <p>📩 Email: <a href="mailto:insilicology@gmail.com" className="text-purple-600 hover:underline">insilicology@gmail.com</a></p>
                  <p>📲 WhatsApp: <a href="https://wa.me/+8801987718298" target="_blank" className="text-purple-600 hover:underline">+8801987718298</a></p>
                  <p>🔗 Facebook: <a href="https://www.facebook.com/insilicology" target="_blank" className="text-purple-600 hover:underline">facebook.com/insilicology</a></p>
                  <p>🌐 Website: <a href="https://www.insilicology.org" target="_blank" className="text-purple-600 hover:underline">www.insilicology.org</a></p>
                </div>
              </div>

              {course.seats && (
                <div className="mt-3 text-xs text-gray-500 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
                  🔥 Seats are limited — {course.seats}
                </div>
              )}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What you&apos;ll learn</h2>
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

            {/* Course Roadmap - modern UI */}
            {/* {course.roadmap && course.roadmap.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Course Roadmap</h3>
                      <p className="text-sm text-gray-600">Step-by-step learning path</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.roadmap.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )} */}

            {/* Why Join - modern UI */}
            {course.why_join && course.why_join.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Why join this course?</h3>
                      <p className="text-sm text-gray-600">Key benefits and outcomes</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.why_join.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-green-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certificate */}
            {course.certificate && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate</h2>
                <div className="flex justify-center rounded-sm border-2 border-gray-300 overflow-hidden">
                  <img src="/certificates/wordpress-cert.png" alt="Certificate" className="w-full max-w-md h-auto rounded-sm" loading="lazy" />
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