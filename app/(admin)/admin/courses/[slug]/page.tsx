"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";

type CourseType = "live" | "recorded";

type ArrayField = "included" | "topics" | "roadmap" | "why_join";

interface EditCourseForm {
  title: string;
  slug: string;
  type: CourseType;
  duration: string;
  price_regular: string;
  price_offer: string;
  poster: string;
  description: string;
  starts_on: string; // yyyy-mm-dd
  is_published: boolean;
  dates: string;
  language: string;
  seats: string;
  time_set: string; // HH:MM
  roadmap: string[];
  why_join: string[];
  included: string[];
  topics: string[];
}

interface CourseUpdatePayload {
  title: string;
  slug: string;
  type: CourseType;
  duration: string | null;
  price_regular: number;
  price_offer: number;
  poster: string | null;
  description: string | null;
  starts_on: string | null;
  is_published: boolean;
  dates: string | null;
  language: string | null;
  seats: string | null;
  time_set: string | null; // HH:MM:SS
  roadmap: string[];
  why_join: string[];
  included: string[];
  topics: string[];
}

export default function EditCoursePage() {
  const router = useRouter();
  const { slug } = useParams();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");

  const [posterUploading, setPosterUploading] = useState(false);
  const [posterError, setPosterError] = useState<string>("");
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EditCourseForm | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
    if (!slug) return;
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error || !data) {
        setError("Failed to load course");
        setLoading(false);
        return;
      }
      setCourseId(data.id);
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        type: (data.type === "recorded" ? "recorded" : "live") as CourseType,
        duration: data.duration || "",
        price_regular: data.price_regular ? String(data.price_regular) : "",
        price_offer: data.price_offer ? String(data.price_offer) : "",
        poster: data.poster || "",
        description: data.description || "",
        starts_on: data.starts_on ? String(data.starts_on).split("T")[0] : "",
        is_published: Boolean(data.is_published),
        dates: data.dates || "",
        language: data.language || "",
        seats: data.seats || "",
        time_set: data.time_set ? String(data.time_set).slice(0, 5) : "",
        roadmap: Array.isArray(data.roadmap) ? data.roadmap : [""],
        why_join: Array.isArray(data.why_join) ? data.why_join : [""],
        included: Array.isArray(data.included) ? data.included : [""],
        topics: Array.isArray(data.topics) ? data.topics : [""],
      });
      setLoading(false);
    };
    fetchCourse();
  }, [slug, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => (prev ? {
          ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    } : prev));
  };

  const handleArrayChange = (
    name: ArrayField,
    idx: number,
    value: string
  ) => {
    setForm((prev) => {
      if (!prev) return prev;
      const arr = [...prev[name]];
      arr[idx] = value;
      return { ...prev, [name]: arr };
    });
  };

  const handleArrayAdd = (name: ArrayField) => {
    setForm((prev) => (prev ? { ...prev, [name]: [...prev[name], ""] } : prev));
  };

  const handleArrayRemove = (name: ArrayField, idx: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const arr = [...prev[name]];
      arr.splice(idx, 1);
      return { ...prev, [name]: arr };
    });
  };

  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

  const validatePosterFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPG, PNG, or WEBP images are allowed.";
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return "Image must be less than 10MB.";
    }
    return "";
  };

  const uploadPoster = async (file: File) => {
    setPosterError("");
    const validationMessage = validatePosterFile(file);
    if (validationMessage) {
      setPosterError(validationMessage);
      return;
    }
    setPosterUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const safeSlug = (form?.slug || "course").replace(/[^a-zA-Z0-9-_]/g, "-");
      const filePath = `courses/${safeSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("course-posters")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setPosterError("Failed to upload image: " + uploadError.message);
        return;
      }
      const { data } = supabase.storage.from("course-posters").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl || "";
      if (!publicUrl) {
        setPosterError("Failed to get public URL for uploaded image.");
        return;
      }
      setForm((prev) => (prev ? { ...prev, poster: publicUrl } : prev));
    } finally {
      setPosterUploading(false);
    }
  };

  const handlePosterDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void uploadPoster(e.dataTransfer.files[0]);
    }
  };

  const handlePosterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadPoster(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError("");
    setSubmitting(true);

    if (!form.title || !form.slug || !form.type) {
      setError("Title, slug and type are required.");
      setSubmitting(false);
      return;
    }

    const payload: CourseUpdatePayload = {
      title: form.title,
      slug: form.slug,
      type: form.type,
      duration: form.duration || null,
      price_regular: form.price_regular ? Number(form.price_regular) : 0,
      price_offer: form.price_offer ? Number(form.price_offer) : 0,
      poster: form.poster || null,
      description: form.description || null,
      starts_on: form.starts_on ? new Date(form.starts_on).toISOString() : null,
      is_published: form.is_published,
      dates: form.dates || null,
      language: form.language || null,
      seats: form.seats || null,
      time_set: form.time_set ? `${form.time_set}:00` : null,
      roadmap: form.roadmap.filter((v) => v.trim().length > 0),
      why_join: form.why_join.filter((v) => v.trim().length > 0),
      included: form.included.filter((v) => v.trim().length > 0),
      topics: form.topics.filter((v) => v.trim().length > 0),
    };

    const { error: updateError } = await supabase
      .from("courses")
      .update(payload)
      .eq("id", courseId);

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }
    router.push("/admin/courses");
  };

  if (loading || !form) return <p className="p-6">লোড হচ্ছে...</p>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">কোর্স আপডেট করুন</h1>
      {error && (
        <div className="mb-6 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {([
          { name: "title", label: "কোর্স শিরোনাম" },
          { name: "slug", label: "Slug" },
          { name: "duration", label: "Course Duration" },
          { name: "price_regular", label: "Regular Price" },
          { name: "price_offer", label: "Offer Price" },
          { name: "description", label: "Description", isTextArea: true },
        ] as ReadonlyArray<{ name: "title" | "slug" | "duration" | "price_regular" | "price_offer" | "description"; label: string; isTextArea?: boolean }>).map((field) => (
          <div key={field.name} className={field.isTextArea ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.isTextArea ? (
              <textarea
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              />
            ) : (
            <input
                name={field.name}
                value={form[field.name]}
              onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-white"
            />
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Poster Image</label>
          <div
            onDrop={handlePosterDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => posterInputRef.current?.click()}
            className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${posterUploading ? "opacity-70" : ""}`}
          >
            {form.poster ? (
              <img src={form.poster} alt="Poster" className="max-h-48 object-contain" />
            ) : (
              <p className="text-gray-600">Drag & drop an image here, or click to select</p>
            )}
            {posterUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            {posterError && <p className="text-sm text-red-600 mt-2">{posterError}</p>}
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePosterInput}
            />
          </div>
          {form.poster && (
            <div className="mt-2 flex gap-2 items-center">
              <input
                className="bg-white w-full"
                value={form.poster}
                onChange={(e) => setForm((prev) => (prev ? { ...prev, poster: e.target.value } : prev))}
                placeholder="Poster URL"
              />
              <Button type="button" onClick={() => setForm((prev) => (prev ? { ...prev, poster: "" } : prev))}>Remove</Button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Course Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="live">Live</option>
            <option value="recorded">Recorded</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="starts_on"
            value={form.starts_on}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dates (text)</label>
          <input name="dates" value={form.dates} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <input name="language" value={form.language} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Seats (text)</label>
          <input name="seats" value={form.seats} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time (HH:MM 24h UTC)</label>
          <input type="time" name="time_set" value={form.time_set} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-white" />
          <p className="text-xs text-gray-500 mt-1">All times are in UTC (Coordinated Universal Time)</p>
        </div>

        {([
          { name: "included", label: "What's included?" },
          { name: "topics", label: "Topics (tags)" },
        ] as ReadonlyArray<{ name: Extract<ArrayField, "included" | "topics">; label: string }>).map(({ name, label }) => (
          <div key={name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {form[name].map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input 
                  value={val} 
                  onChange={(e) => handleArrayChange(name, idx, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                />
                <Button type="button" onClick={() => handleArrayRemove(name, idx)}>
                  -
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => handleArrayAdd(name)}>+ Add</Button>
          </div>
        ))}

        {([
          { name: "roadmap", label: "Course Roadmap" },
          { name: "why_join", label: "Why Join" },
        ] as ReadonlyArray<{ name: Extract<ArrayField, "roadmap" | "why_join">; label: string }>).map(({ name, label }) => (
          <div key={name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {form[name].map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
									<input
                  value={val}
                  onChange={(e) => handleArrayChange(name, idx, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                />
                <Button type="button" onClick={() => handleArrayRemove(name, idx)}>
                  -
									</Button>
								</div>
							))}
            <Button type="button" onClick={() => handleArrayAdd(name)}>+ Add</Button>
						</div>
					))}

        <div className="flex items-center space-x-3 md:col-span-2">
          <Switch
            id="is_published"
            checked={form.is_published}
            onCheckedChange={(checked) => setForm((prev) => (prev ? { ...prev, is_published: checked } : prev))}
          />
          <label className="block text-sm font-medium text-gray-700">Publish Course?</label>
				</div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
        </div>
      </form>
    </div>
  );
}


