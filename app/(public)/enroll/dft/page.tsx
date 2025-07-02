"use client";
import React, { useState, useRef } from "react";
import supabase from "@/lib/supabase";
import { UploadCloud, X } from "lucide-react";

// Add type for form state
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
  paymentMethodOther: string;
  payment_screenshot: File | null;
  agreement: boolean;
};

const REQUIRED_FIELDS = [
  "full_name",
  "email",
  "country",
  "experience",
  "comments",
  "payment_method",
  "payment_screenshot",
  "agreement",
];

const PAYMENT_METHODS = [
  { label: "UPI", value: "UPI" },
  { label: "Paypal", value: "Paypal" },
  { label: "Bkash", value: "Bkash" },
  { label: "Other", value: "Other" },
];

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

const STATUS_OPTIONS = [
  { label: "PhD", value: "PhD" },
  { label: "MSc", value: "MSc" },
  { label: "BSc", value: "BSc" },
  { label: "Researcher", value: "Researcher" },
  { label: "Other", value: "Other" },
];

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
  paymentMethodOther: "",
  payment_screenshot: null,
  agreement: false,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DFTEnrollPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validate required fields
    if (!form.full_name || !form.email || !form.country || !form.experience || !form.comments || !form.payment_method || !form.payment_screenshot || !form.agreement) {
      setError("Please fill all required fields and agree to the terms.");
      setLoading(false);
      return;
    }
    if (form.payment_method === "Other" && !form.paymentMethodOther) {
      setError("Please specify your payment method.");
      setLoading(false);
      return;
    }

    // Validate file again
    const file = form.payment_screenshot;
    if (!file) {
      setError("Payment screenshot is required.");
      setLoading(false);
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type.");
      setLoading(false);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB.");
      setLoading(false);
      return;
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const filePath = `dft/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("payment-ss")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Failed to upload payment screenshot: " + uploadError.message);
      setLoading(false);
      return;
    }

    // Get public URL (if private, you may need to generate a signed URL for admin access)
    const { data: urlData } = supabase.storage.from("payment-ss").getPublicUrl(filePath);
    const payment_screenshot_url = urlData?.publicUrl || "";

    // Insert registration data
    const { error: insertError } = await supabase.from("dft_reg").insert([
      {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        messenger: form.messenger,
        telegram: form.telegram,
        country: form.country,
        state: form.state,
        city: form.city,
        status: form.status,
        experience: form.experience,
        comments: form.comments,
        payment_method: form.payment_method === "Other" ? form.paymentMethodOther : form.payment_method,
        payment_screenshot_url,
      },
    ]);

    if (insertError) {
      setError("Failed to submit registration. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setForm(initialState);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper for red star
  const RedStar = () => <span className="text-red-500 ml-0.5">*</span>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-2xl">
        {/* Course Description Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-2 text-lg font-semibold">
            <span className="mr-2" role="img" aria-label="calendar">📅</span>3-Day Intensive Online Workshop
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
            <div>
              <div><span className="font-semibold">Duration:</span> 3 Days</div>
              <div><span className="font-semibold">Start Dates (Choose One):</span> 12th / 15th / 20th July 2025</div>
              <div><span className="font-semibold">Time:</span> 11:00 PM (GMT+6)</div>
              <div><span className="font-semibold">Platform:</span> Zoom / Google Meet</div>
            </div>
            <div>
              <div><span className="font-semibold">Language:</span> English</div>
              <div><span className="font-semibold">Certificate:</span> Provided (Digital PDF)</div>
              <div><span className="font-semibold">Seats Available:</span> Only 15 per batch</div>
              <div><span className="font-semibold">Mode:</span> Live + Recorded Access</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-semibold mb-1">Course Roadmap: <span className="font-normal">From Basics to Advanced Post-Processing</span></div>
            <ol className="list-decimal list-inside text-gray-700 text-sm space-y-0.5">
              <li>Introduction to DFT</li>
              <li>Software & Molecular Setup</li>
              <li>Basis Sets & Functionals</li>
              <li>Geometry Optimization</li>
              <li>Frequency & Thermochemical Calculations</li>
              <li>IR & Raman Spectra Simulation</li>
              <li>HOMO–LUMO & Orbital Analysis</li>
              <li>Reactivity Descriptors</li>
              <li>Post-Processing Tools</li>
              <li>Speed Up Your DFT Calculations</li>
            </ol>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <h1 className="text-3xl font-bold mb-2 text-center">DFT Course Registration</h1>
            {success && (
              <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 text-center">
                Registration successful! We will contact you soon.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block font-medium mb-1">Full Name <RedStar /></label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block font-medium mb-1">Email <RedStar /></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Country <RedStar /></label>
                <input type="text" name="country" value={form.country} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Messenger</label>
                <input type="text" name="messenger" value={form.messenger} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Telegram</label>
                <input type="text" name="telegram" value={form.telegram} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">State</label>
                <input type="text" name="state" value={form.state} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              {/* Academic/Professional Status dropdown */}
              <div>
                <label className="block font-medium mb-1">Academic/Professional Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Select...</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {form.status === "Other" && (
                  <input type="text" name="status" value={form.status} onChange={handleChange} placeholder="Please specify" className="mt-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                )}
              </div>
            </div>
            {/* Experience radio buttons */}
            <div>
              <label className="block font-medium mb-1">Have you used DFT or quantum software before? <RedStar /></label>
              <div className="flex space-x-6 mt-1">
                <label className="inline-flex items-center">
                  <input type="radio" name="experience" value="Yes" checked={form.experience === "Yes"} onChange={handleChange} required className="accent-blue-600" />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="experience" value="No" checked={form.experience === "No"} onChange={handleChange} required className="accent-blue-600" />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            {/* Comments field with new label */}
            <div>
              <label className="block font-medium mb-1">What do you hope to gain from this course? <RedStar /></label>
              <textarea name="comments" value={form.comments} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={2} />
            </div>
            <div>
              <label className="block font-medium mb-1">Preferred Payment Method <RedStar /></label>
              <select name="payment_method" value={form.payment_method} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Select...</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              {form.payment_method === "Other" && (
                <input type="text" name="paymentMethodOther" value={form.paymentMethodOther} onChange={handleChange} placeholder="Please specify" className="mt-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              )}
            </div>
            {/* Payment Details Section - moved here */}
            <div className="mb-2 text-center">
              <div className="text-lg font-semibold">Course Fee - <span className="text-blue-600">$50</span></div>
              <div className="mt-2 text-sm text-gray-700">
                <div>UPI ID: <span className="font-mono">9123799685@axisb</span></div>
                <div>Paypal (int.): <span className="font-mono">hsifat14@gmail.com</span></div>
                <div>Bkash: <span className="font-mono">+8801994236422</span></div>
              </div>
            </div>
            {/* Payment Screenshot Upload */}
            <div>
              <label className="block font-medium mb-1">Payment Screenshot <RedStar /></label>
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${form.payment_screenshot ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'} hover:border-blue-400`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                {form.payment_screenshot ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-700 font-medium">{form.payment_screenshot.name}</span>
                    <button type="button" onClick={removeFile} className="text-red-500 hover:text-red-700"><X size={20} /></button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="text-3xl text-blue-400 mb-2" />
                    <span className="text-gray-700">Drag & drop or <span className="text-blue-600 underline">browse</span> to upload</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, WEBP. Max 10MB.</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXT}
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
              {fileError && <div className="text-xs text-red-500 mt-1">{fileError}</div>}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreement"
                checked={form.agreement}
                onChange={handleChange}
                required
                className="mr-2 accent-blue-600"
              />
              <label className="text-sm font-medium">
                I understand this is a paid course and agree to receive payment details. <RedStar />
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
