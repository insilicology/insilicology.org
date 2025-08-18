"use client";

import { useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type PortfolioForm = {
  project_name: string;
  slug: string;
  project_description: string;
  project_duration: string;
  project_country: string;
  project_budget: string;
  images: string[];
  files: string[];
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function NewPortfolioPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [form, setForm] = useState<PortfolioForm>({
    project_name: "",
    slug: "",
    project_description: "",
    project_duration: "",
    project_country: "",
    project_budget: "",
    images: [],
    files: [],
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG, WEBP allowed.";
    if (file.size > MAX_IMAGE_SIZE) return "Max 10MB per image.";
    return "";
  };

  const onDropImages = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    await uploadImages(files);
  };

  const onPickImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadImages(files);
  };

  const uploadImages = async (files: File[]) => {
    if (files.length === 0) return;
    setUploadError("");
    setUploadingImages(true);
    try {
      const safeSlug = (form.slug || form.project_name || "new").replace(/[^a-zA-Z0-9-_]/g, "-");
      for (const file of files) {
        const v = validateImage(file);
        if (v) {
          setUploadError(v);
          continue;
        }
        const ext = file.name.split(".").pop();
        const path = `images/${safeSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) {
          setUploadError(error.message);
          continue;
        }
        const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
        const publicUrl = data?.publicUrl;
        if (publicUrl) {
          setForm((prev) => ({ ...prev, images: [...prev.images, publicUrl] }));
        }
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const onDropFiles = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    await uploadFiles(files);
  };

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setFileUploadError("");
    setUploadingFiles(true);
    try {
      const safeSlug = (form.slug || form.project_name || "new").replace(/[^a-zA-Z0-9-_]/g, "-");
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `files/${safeSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) {
          setFileUploadError(error.message);
          continue;
        }
        const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
        const publicUrl = data?.publicUrl;
        if (publicUrl) {
          setForm((prev) => ({ ...prev, files: [...prev.files, publicUrl] }));
        }
      }
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.project_name || !form.slug) return;
    const payload = {
      project_name: form.project_name,
      slug: form.slug,
      project_description: form.project_description || null,
      project_duration: form.project_duration || null,
      project_country: form.project_country || null,
      project_budget: form.project_budget || null,
      images: form.images,
      files: form.files,
    };
    const { error } = await supabase.from("portfolio").insert([payload]);
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/admin/portfolio");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">New Portfolio Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.project_name}
              onChange={(e) => setForm((p) => ({ ...p, project_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.project_country} onChange={(e) => setForm((p) => ({ ...p, project_country: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.project_duration} onChange={(e) => setForm((p) => ({ ...p, project_duration: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.project_budget} onChange={(e) => setForm((p) => ({ ...p, project_budget: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="w-full border rounded-lg px-3 py-2" rows={5} value={form.project_description} onChange={(e) => setForm((p) => ({ ...p, project_description: e.target.value }))} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images (drag & drop or click)</label>
          <div
            onDrop={onDropImages}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => imageInputRef.current?.click()}
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${uploadingImages ? "opacity-70" : ""}`}
          >
            <p className="text-gray-600">Drag & drop images here, or click to select</p>
            {uploadingImages && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
            <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPickImages} />
          </div>
          {form.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={url} alt="uploaded" className="w-full h-24 object-cover rounded" />
                  <button type="button" className="absolute top-1 right-1 bg-white/80 text-xs px-1 rounded" onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Files (drag & drop or click)</label>
          <div
            onDrop={onDropFiles}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${uploadingFiles ? "opacity-70" : ""}`}
          >
            <p className="text-gray-600">Drag & drop files here, or click to select</p>
            {uploadingFiles && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            {fileUploadError && <p className="text-sm text-red-600 mt-2">{fileUploadError}</p>}
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onPickFiles} />
          </div>
          {form.files.length > 0 && (
            <div className="mt-3 space-y-2">
              {form.files.map((url, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <a href={url} target="_blank" className="text-purple-700 hover:underline" rel="noreferrer">{url}</a>
                  <button type="button" className="text-red-600" onClick={() => setForm((p) => ({ ...p, files: p.files.filter((_, i) => i !== idx) }))}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </div>
  );
}


