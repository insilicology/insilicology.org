import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

type Portfolio = {
  id: string;
  slug: string;
  project_name: string;
  project_description: string | null;
  project_duration: string | null;
  project_country: string | null;
  project_budget: string | null;
  images: string[] | null;
  files: string[] | null;
};

export async function generateMetadata() {
  return {
    title: "Portfolio",
    description: "Explore our portfolio projects and case studies.",
    metadataBase: new URL("https://insilicology.org"),
    alternates: { canonical: "/portfolio" },
    openGraph: {
      title: "Portfolio",
      description: "Explore our portfolio projects and case studies.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Portfolio",
      description: "Explore our portfolio projects and case studies.",
    },
  } as const;
}

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Portfolio</h1>
        <p className="text-gray-600">Failed to load projects.</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Portfolio</h1>
        <p className="text-gray-600">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {projects.map((project: Portfolio) => {
          const imageSrc = project.images && project.images.length > 0 ? project.images[0] : "/opengraph-image.png";
          return (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg shadow-purple-200 hover:shadow-xl transition"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={project.project_name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">
                  {project.project_name}
                </h2>
                {project.project_country || project.project_duration || project.project_budget ? (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {[project.project_country, project.project_duration, project.project_budget]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


