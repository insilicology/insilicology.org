import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data } = await supabase.from("portfolio").select("slug");
  const params = (data || []).map((p: { slug: string }) => ({ slug: p.slug }));
  return params;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio")
    .select("project_name, project_description")
    .eq("slug", params.slug)
    .maybeSingle();
  const title = data ? data.project_name : "Portfolio Project";
  const description = data?.project_description || "Project details and insights.";
  return {
    title,
    description,
    metadataBase: new URL("https://insilicology.org"),
    alternates: { canonical: `/portfolio/${params.slug}` },
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  } as const;
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("portfolio")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!project) {
    notFound();
  }

  const imageSrc = project.images && project.images.length > 0 ? project.images[0] : "/opengraph-image.png";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/portfolio" className="text-sm text-purple-600 hover:underline">← Back to portfolio</Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.project_name}</h1>
      {project.project_country || project.project_duration || project.project_budget ? (
        <p className="text-gray-600 mb-6">
          {[project.project_country, project.project_duration, project.project_budget].filter(Boolean).join(" • ")}
        </p>
      ) : null}

      <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden shadow">
        <Image src={imageSrc} alt={project.project_name} fill className="object-cover" />
      </div>

      {project.project_description ? (
        <div className="prose max-w-none mt-8">
          <p className="whitespace-pre-line">{project.project_description}</p>
        </div>
      ) : null}

      {project.images && project.images.length > 1 ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.images.slice(1).map((img: string, idx: number) => (
              <div key={idx} className="relative w-full aspect-video rounded overflow-hidden">
                <Image src={img} alt={`${project.project_name} ${idx + 2}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {project.files && project.files.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Files</h2>
          <ul className="list-disc pl-5 space-y-2">
            {project.files.map((file: string, idx: number) => (
              <li key={idx}>
                <a href={file} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}


