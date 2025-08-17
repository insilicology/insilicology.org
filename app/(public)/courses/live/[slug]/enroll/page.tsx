"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";

type LiveRegFormState = {
  full_name: string;
  email: string;
  phone: string;
  messenger: string;
  telegram: string;
  country: string;
  state: string;
  city: string;
  status: string;
  experience: string;
  comments: string;
  payment_method: string;
  payment_screenshot: File | null;
  discipline: string;
  university: string;
};

const initialState: LiveRegFormState = {
  full_name: "",
  email: "",
  phone: "",
  messenger: "",
  telegram: "",
  country: "",
  state: "",
  city: "",
  status: "",
  experience: "",
  comments: "",
  payment_method: "",
  payment_screenshot: null,
  discipline: "",
  university: "",
};

export default function LiveCourseEnrollPage() {
  const params = useParams<{ slug: string }>();
  const [form, setForm] = useState<LiveRegFormState>(initialState);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const slug = params?.slug;
      if (!slug) return;
      const { data, error } = await supabase
        .from("courses")
        .select("id, type")
        .eq("slug", slug)
        .eq("type", "live")
        .single();
      if (error || !data) {
        setError("Course not found.");
        return;
      }
      setCourseId(data.id);
    };
    fetchCourse();
  }, [params?.slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!courseId) {
      setError("Course not ready. Please reload the page.");
      return;
    }
    if (!form.full_name || !form.email) {
      setError("Full name and email are required.");
      return;
    }
    setLoading(true);
    let payment_screenshot_url: string | null = null;
    if (form.payment_screenshot) {
      const file = form.payment_screenshot;
      const fileExt = file.name.split(".").pop();
      const filePath = `enrollments/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-ss")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setError("Failed to upload payment screenshot.");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("payment-ss").getPublicUrl(filePath);
      payment_screenshot_url = urlData?.publicUrl || null;
    }

    const { error: insertError } = await supabase.from("live_course_reg").insert([
      {
        course: courseId,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        messenger: form.messenger || null,
        telegram: form.telegram || null,
        country: form.country || null,
        state: form.state || null,
        city: form.city || null,
        status: form.status || null,
        experience: form.experience ? [form.experience] : null,
        comments: form.comments || null,
        payment_method: form.payment_method || null,
        payment_screenshot_url,
        discipline: form.discipline || null,
        university: form.university || null,
      },
    ]);

    if (insertError) {
      setError("Failed to submit. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setForm(initialState);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Enroll in Live Course</h1>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
            Registration submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Payment Screenshot</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, payment_screenshot: e.target.files?.[0] || null }))
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discipline</label>
              <input
                type="text"
                name="discipline"
                value={form.discipline}
                onChange={handleChange}
                placeholder="e.g., Chemistry, Physics"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">University</label>
              <input
                type="text"
                name="university"
                value={form.university}
                onChange={handleChange}
                placeholder="e.g., University of Dhaka"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Messenger</label>
              <input
                type="text"
                name="messenger"
                value={form.messenger}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Telegram</label>
              <input
                type="text"
                name="telegram"
                value={form.telegram}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <input
                type="text"
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="e.g., MSc, PhD, Researcher"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience</label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}


