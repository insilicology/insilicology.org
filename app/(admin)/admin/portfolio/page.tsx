"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/Button";

type Portfolio = {
  id: string;
  slug: string;
  project_name: string;
  project_country: string | null;
  project_duration: string | null;
  project_budget: string | null;
  images: string[] | null;
};

export default function AdminPortfolioListPage() {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("portfolio")
        .select("id, slug, project_name, project_country, project_duration, project_budget, images")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching portfolio:", error.message);
      } else {
        setProjects((data || []) as Portfolio[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Portfolio Projects</h1>
        <Link href="/admin/portfolio/new">
          <Button>+ New Project</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const thumb = p.images && p.images.length > 0 ? p.images[0] : "/opengraph-image.png";
            return (
              <div key={p.id} className="border rounded-lg shadow bg-white overflow-hidden">
                <div className="relative w-full h-44">
                  <Image src={thumb} alt={p.project_name} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <h2 className="text-lg font-semibold">{p.project_name}</h2>
                  <p className="text-sm text-gray-600">
                    {[p.project_country, p.project_duration, p.project_budget].filter(Boolean).join(" • ")}
                  </p>
                  <Link href={`/admin/portfolio/${p.slug}`} className="inline-block text-purple-600 hover:underline text-sm mt-2">
                    Edit →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


