import CourseArchiveAll from "@/components/courses/CourseArchiveAll";

export async function generateMetadata() {
  return {
    title: "All Courses",
    description: "Browse all courses offered by Skilltori, including live and recorded sessions designed to boost your skills.",
    keywords: [
      "All Courses",
      "Browse all courses",
      "Live and recorded sessions",
      "Boost your skills",
    ],
    metadataBase: new URL('https://insilicology.org'),
    alternates: {
      canonical: '/courses',
    },
    openGraph: {
      title: "All Courses",
      description: "Browse all courses offered by Skilltori, including live and recorded sessions designed to boost your skills.",
    },
    twitter: {
      card: 'summary_large_image',
      title: "All Courses",
      description: "Browse all courses offered by Skilltori, including live and recorded sessions designed to boost your skills.",
    },
  };
}

export default async function AllCoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">All Courses</h1>
      <CourseArchiveAll />
    </div>
  );
}
