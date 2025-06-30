"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";

interface FAQ {
  question: string;
  answer: string;
}

export default function CreateCoursePage() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category_id: "",
    instructor_id: "",
    type: "recorded",
    difficulty: "beginner",
    price_regular: "",
    price_offer: "",
    included: [""] as string[],
    for_whom: [""] as string[],
    requirements: [""] as string[],
    duration: "",
    poster: "",
    og_image: "",
    description: "",
    enroll_link: "",
    certificate: "",
    topics: [""] as string[],
    faqs: [] as FAQ[],
    starts_on: "",
    is_published: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">নতুন কোর্স তৈরি করুন</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Text Inputs */}
        {[
          { name: "title", label: "কোর্স শিরোনাম" },
          { name: "slug", label: "Slug" },
          { name: "duration", label: "Course Duration" },
          { name: "price_regular", label: "Regular Price" },
          { name: "price_offer", label: "Offer Price" },
          { name: "poster", label: "Poster Image URL" },
          { name: "og_image", label: "OG Image URL" },
          { name: "enroll_link", label: "Enroll Link" },
          { name: "certificate", label: "Certificate" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              name={field.name}
              value={form[field.name as keyof typeof form] as string}
              onChange={handleChange}
            />
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
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="starts_on"
            value={form.starts_on}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            id="is_published"
            checked={form.is_published}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_published: checked }))}
          />
          <label className="block text-sm font-medium text-gray-700">Publish Course?</label>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Course Description</label>
          <textarea
            name="description"
            value={form.description}
            rows={5}
            onChange={handleChange}
          />
        </div>

        {/* Array Inputs */}
        {[
          { name: "for_whom", label: "Who is this for?" },
          { name: "included", label: "What's included?" },
          { name: "requirements", label: "Requirements" },
          { name: "topics", label: "Topics (tags)" },
        ].map(({ name, label }) => (
          <div key={name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {(form[name as keyof typeof form] as string[]).map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={val}
                  onChange={(e) => {
                    const arr = [...(form[name as keyof typeof form] as string[])];
                    arr[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, [name]: arr }));
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const arr = [...(form[name as keyof typeof form] as string[])];
                    arr.splice(idx, 1);
                    setForm((prev) => ({ ...prev, [name]: arr }));
                  }}
                >
                  -
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const arr = [...(form[name as keyof typeof form] as string[])];
                arr.push("");
                setForm((prev) => ({ ...prev, [name]: arr }));
              }}
            >
              + Add
            </Button>
          </div>
        ))}

        <Button type="submit" className="md:col-span-2 mt-6">
          Create Course
        </Button>
      </form>
    </div>
  );
}
