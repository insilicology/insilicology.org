"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/Button";

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

export default function EditPortfolioPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [project, setProject] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileUploadError, setFileUploadError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();
      if (!error) setProject(data as Portfolio);
      setLoading(false);
    };
    fetchProject();
  }, [params.slug, supabase]);

  const updateField = <K extends keyof Portfolio>(field: K, value: Portfolio[K]) => {
    setProject((prev) => (prev ? ({ ...prev, [field]: value } as Portfolio) : prev));
  };

  const uploadToBucket = async (files: File[], type: "images" | "files") => {
    if (!project) return;
    if (files.length === 0) return;
    if (type === "images") {
      setUploadingImages(true);
    } else {
      setUploadingFiles(true);
    }
    try {
      const safeSlug = (project.slug || project.project_name || "project").replace(/[^a-zA-Z0-9-_]/g, "-");
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${type}/${safeSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) {
          (type === "images" ? setUploadError : setFileUploadError)(error.message);
          continue;
        }
        const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
        const publicUrl = data?.publicUrl;
        if (publicUrl) {
          const list = (project[type] || []) as string[];
          updateField(type, [...list, publicUrl]);
        }
      }
    } finally {
      if (type === "images") {
        setUploadingImages(false);
      } else {
        setUploadingFiles(false);
      }
    }
  };

  const save = async () => {
    if (!project) return;
    setSaving(true);
    const { id, ...payload } = project;
    const { error } = await supabase.from("portfolio").update(payload).eq("id", id);
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/admin/portfolio");
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10">Loading...</div>;
  if (!project) return <div className="max-w-5xl mx-auto px-4 py-10">Not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input className="w-full border rounded-lg px-3 py-2" value={project.project_name} onChange={(e) => updateField("project_name", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input className="w-full border rounded-lg px-3 py-2" value={project.slug} onChange={(e) => updateField("slug", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input className="w-full border rounded-lg px-3 py-2" value={project.project_country || ""} onChange={(e) => updateField("project_country", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <input className="w-full border rounded-lg px-3 py-2" value={project.project_duration || ""} onChange={(e) => updateField("project_duration", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Budget</label>
          <input className="w-full border rounded-lg px-3 py-2" value={project.project_budget || ""} onChange={(e) => updateField("project_budget", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea className="w-full border rounded-lg px-3 py-2" rows={5} value={project.project_description || ""} onChange={(e) => updateField("project_description", e.target.value)} />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <div onDrop={(e) => { e.preventDefault(); void uploadToBucket(Array.from(e.dataTransfer.files || []), "images"); }} onDragOver={(e) => e.preventDefault()} onClick={() => imageInputRef.current?.click()} className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${uploadingImages ? "opacity-70" : ""}`}>
          <p className="text-gray-600">Drag & drop images here, or click to select</p>
          {uploadingImages && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
          <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void uploadToBucket(Array.from(e.target.files || []), "images")} />
        </div>
        {project.images && project.images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {project.images.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt="uploaded" className="w-full h-24 object-cover rounded" />
                <button type="button" className="absolute top-1 right-1 bg-white/80 text-xs px-1 rounded" onClick={() => updateField("images", (project.images || []).filter((_, i) => i !== idx))}>x</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Files</label>
        <div onDrop={(e) => { e.preventDefault(); void uploadToBucket(Array.from(e.dataTransfer.files || []), "files"); }} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${uploadingFiles ? "opacity-70" : ""}`}>
          <p className="text-gray-600">Drag & drop files here, or click to select</p>
          {uploadingFiles && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          {fileUploadError && <p className="text-sm text-red-600 mt-2">{fileUploadError}</p>}
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => void uploadToBucket(Array.from(e.target.files || []), "files")} />
        </div>
        {project.files && project.files.length > 0 && (
          <div className="mt-3 space-y-2">
            {project.files.map((url, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <a href={url} target="_blank" className="text-purple-700 hover:underline" rel="noreferrer">{url}</a>
                <button type="button" className="text-red-600" onClick={() => updateField("files", (project.files || []).filter((_, i) => i !== idx))}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
    </div>
  );
}


