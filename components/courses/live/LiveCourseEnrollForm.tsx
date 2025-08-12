"use client";

import React, { useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabase";
import * as countryCodes from "country-codes-list";
import Image from "next/image";

export interface LiveCourseEnrollFormProps {
  courseId?: string;
  slug?: string;
  priceRegular?: number;
  priceOffer?: number;
}

type FormState = {
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

const initialState: FormState = {
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

export default function LiveCourseEnrollForm({ courseId: propCourseId, slug, priceRegular, priceOffer }: LiveCourseEnrollFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [courseId, setCourseId] = useState<string | null>(propCourseId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const STATUS_OPTIONS = [
    { label: "PhD", value: "PhD" },
    { label: "MSc", value: "MSc" },
    { label: "BSc", value: "BSc" },
    { label: "Researcher", value: "Researcher" },
    { label: "Other", value: "Other" },
  ];

  const COUNTRY_LIST = countryCodes.customList(
    "countryCode",
    "{countryNameEn}"
  );

  const PAYMENT_METHODS = [
    { label: "UPI", value: "UPI" },
    { label: "Paypal", value: "Paypal" },
    { label: "Bkash", value: "Bkash" },
    { label: "Other", value: "Other" },
  ];

  const selectedPriceUSD = useMemo(() => {
    if (typeof priceOffer === 'number' && typeof priceRegular === 'number' && priceOffer > 0 && priceRegular > 0) {
      return Math.min(priceOffer, priceRegular);
    }
    if (typeof priceOffer === 'number' && priceOffer > 0) return priceOffer;
    if (typeof priceRegular === 'number' && priceRegular > 0) return priceRegular;
    return null;
  }, [priceOffer, priceRegular]);

  useEffect(() => {
    if (propCourseId) {
      setCourseId(propCourseId);
      return;
    }
    const fetchCourse = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from("courses")
        .select("id, type")
        .eq("slug", slug)
        .eq("type", "live")
        .single();
      if (!error && data) {
        setCourseId(data.id);
      }
    };
    fetchCourse();
  }, [propCourseId, slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = useMemo(() => {
    return (
      !!courseId &&
      !!form.full_name &&
      !!form.email &&
      !!form.phone &&
      !!form.messenger &&
      !!form.country &&
      !!form.state &&
      !!form.city &&
      !!form.status &&
      !!form.experience
    );
  }, [
    courseId,
    form.full_name,
    form.email,
    form.phone,
    form.messenger,
    form.country,
    form.state,
    form.city,
    form.status,
    form.experience,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!canSubmit) {
      setError("Please complete required fields.");
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
    <div id="enroll" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Enroll now</h2>
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">Registration submitted successfully.</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Payment Screenshot</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
            onChange={(e) => setForm((prev) => ({ ...prev, payment_screenshot: e.target.files?.[0] || null }))}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Discipline <span className="text-red-500">*</span></label>
            <input type="text" name="discipline" value={form.discipline} onChange={handleChange} required placeholder="e.g., Chemistry" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">University <span className="text-red-500">*</span></label>
            <input type="text" name="university" value={form.university} onChange={handleChange} required placeholder="e.g., University of Dhaka" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Messenger/WhatsApp <span className="text-red-500">*</span></label>
            <input type="text" name="messenger" value={form.messenger} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telegram</label>
            <input type="text" name="telegram" value={form.telegram} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country <span className="text-red-500">*</span></label>
            <select name="country" value={form.country} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Select your country...</option>
              {Object.entries(COUNTRY_LIST).map(([code, name]) => (
                <option key={code} value={name as string}>{name as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State <span className="text-red-500">*</span></label>
            <input type="text" name="state" value={form.state} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
            <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Academic/Professional Status <span className="text-red-500">*</span></label>
            <select name="status" value={form.status} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Select...</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {form.status === "Other" && (
              <input type="text" name="status" value={form.status} onChange={handleChange} placeholder="Please specify" className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience <span className="text-red-500">*</span></label>
            <select name="experience" value={form.experience} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comments</label>
          <textarea name="comments" value={form.comments} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preferred Payment Method</label>
          <select name="payment_method" value={form.payment_method} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="">Select...</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          {form.payment_method === 'Other' && (
            <input type="text" name="payment_method" value={form.payment_method} onChange={handleChange} placeholder="Please specify" className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2" />
          )}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Course Fee {selectedPriceUSD !== null ? `- $${selectedPriceUSD.toLocaleString('en-US')}` : ''}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 mb-2 relative">
                <Image src="/logos/logo-upi.webp" alt="UPI" fill className="object-contain" />
              </div>
              <div className="font-semibold text-gray-800 mb-1">UPI</div>
              <div className="font-mono text-purple-600">9123799685@axisb</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 mb-2 relative">
                <Image src="/logos/logo-paypal.svg" alt="Paypal" fill className="object-contain" />
              </div>
              <div className="font-semibold text-gray-800 mb-1">Paypal (int.)</div>
              <div className="font-mono text-purple-600">hsifat14@gmail.com</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 mb-2 relative">
                <Image src="/logos/logo-bkash.png" alt="Bkash" fill className="object-contain" />
              </div>
              <div className="font-semibold text-gray-800 mb-1">Bkash</div>
              <div className="font-mono text-purple-600">+8801994236422</div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Screenshot</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
            onChange={(e) => setForm((prev) => ({ ...prev, payment_screenshot: e.target.files?.[0] || null }))}
            className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">Upload proof of payment; supported: PDF, DOC, PPT, JPG, PNG, WEBP.</p>
        </div>

        <button type="submit" disabled={loading || !canSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}


