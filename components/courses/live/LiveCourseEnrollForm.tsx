"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // File upload helpers (modern UI like DFT page)
  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  const ACCEPTED_EXT = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp";
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (file: File | null) => {
    setFileError("");
    if (!file) {
      setForm((prev) => ({ ...prev, payment_screenshot: null }));
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Unsupported file type.");
      setForm((prev) => ({ ...prev, payment_screenshot: null }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 10MB.");
      setForm((prev) => ({ ...prev, payment_screenshot: null }));
      return;
    }
    setForm((prev) => ({ ...prev, payment_screenshot: file }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, payment_screenshot: null }));
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setFileError("");
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div id="enroll" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow">
          Enroll Now
        </div>
        <h2 className="mt-3 text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Secure your seat</h2>
      </div>
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 text-center">
          Registration submitted successfully.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* Modern payment screenshot uploader */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">Payment Screenshot</label>
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              form.payment_screenshot ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            {form.payment_screenshot ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-green-700 font-medium">{form.payment_screenshot.name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-gray-700">Drag & drop or <span className="text-purple-600 underline">browse</span> to upload</span>
                <span className="text-xs text-gray-500 mt-2 block">PDF, DOC, PPT, JPG, PNG, WEBP. Max 10MB.</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXT}
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
          {fileError && <div className="text-xs text-red-500 mt-2">{fileError}</div>}
        </div>

        <button type="submit" disabled={loading || !canSubmit} className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}


