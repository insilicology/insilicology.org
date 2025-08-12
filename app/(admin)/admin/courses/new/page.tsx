"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "live" as "live" | "recorded",
    duration: "",
    price_regular: "",
    price_offer: "",
    poster: "",
    description: "",
    starts_on: "",
    is_published: false,
    // New fields
    dates: "",
    language: "",
    seats: "",
    time_set: "",
    roadmap: [""] as string[],
    why_join: [""] as string[],
    included: [""] as string[],
    topics: [""] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayChange = (
    name: "included" | "topics" | "roadmap" | "why_join",
    idx: number,
    value: string
  ) => {
    setForm((prev) => {
      const arr = [...prev[name]];
      arr[idx] = value;
      return { ...prev, [name]: arr };
    });
  };

  const handleArrayAdd = (name: "included" | "topics" | "roadmap" | "why_join") => {
    setForm((prev) => ({ ...prev, [name]: [...prev[name], ""] }));
  };

  const handleArrayRemove = (name: "included" | "topics" | "roadmap" | "why_join", idx: number) => {
    setForm((prev) => {
      const arr = [...prev[name]];
      arr.splice(idx, 1);
      return { ...prev, [name]: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    // Basic validation
    if (!form.title || !form.slug || !form.type) {
      setError("Title, slug and type are required.");
      setSubmitting(false);
      return;
    }

    const payload: any = {
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

    const { error } = await supabase.from("courses").insert([payload]);
    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    router.push("/admin/courses");
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">নতুন কোর্স তৈরি করুন</h1>
      {error && (
        <div className="mb-6 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Inputs */}
        {[
          { name: "title", label: "কোর্স শিরোনাম" },
          { name: "slug", label: "Slug" },
          { name: "duration", label: "Course Duration" },
          { name: "price_regular", label: "Regular Price" },
          { name: "price_offer", label: "Offer Price" },
          { name: "poster", label: "Poster Image URL" },
          { name: "description", label: "Description", isTextArea: true },
        ].map((field) => (
          <div key={field.name} className={field.isTextArea ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.isTextArea ? (
              <textarea
                name={field.name}
                value={form[field.name as keyof typeof form] as string}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <input
                name={field.name}
                value={form[field.name as keyof typeof form] as string}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            )}
          </div>
        ))}

        {/* Select Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
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
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dates (text)</label>
          <input name="dates" value={form.dates} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <input name="language" value={form.language} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Seats (text)</label>
          <input name="seats" value={form.seats} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time (HH:MM 24h)</label>
          <input type="time" name="time_set" value={form.time_set} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        {/* Arrays */}
        {[{ name: "included", label: "What's included?" }, { name: "topics", label: "Topics (tags)" }].map(({ name, label }) => (
          <div key={name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {form[name as "included" | "topics"].map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={val}
                  onChange={(e) => handleArrayChange(name as any, idx, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <Button type="button" onClick={() => handleArrayRemove(name as any, idx)}>
                  -
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => handleArrayAdd(name as any)}>+ Add</Button>
          </div>
        ))}

        {[{ name: "roadmap", label: "Course Roadmap" }, { name: "why_join", label: "Why Join" }].map(({ name, label }) => (
          <div key={name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {form[name as "roadmap" | "why_join"].map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={val}
                  onChange={(e) => handleArrayChange(name as any, idx, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <Button type="button" onClick={() => handleArrayRemove(name as any, idx)}>
                  -
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => handleArrayAdd(name as any)}>+ Add</Button>
          </div>
        ))}

        <div className="flex items-center space-x-3 md:col-span-2">
          <Switch
            id="is_published"
            checked={form.is_published}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_published: checked }))}
          />
          <label className="block text-sm font-medium text-gray-700">Publish Course?</label>
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Course"}</Button>
        </div>
      </form>
    </div>
  );
}
