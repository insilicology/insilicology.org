"use client";
import React, { useState, useRef } from "react";
import supabase from "@/lib/supabase";
import { UploadCloud, X, Download, Sparkles, Zap, Target, Users, BookOpen, Clock } from "lucide-react";
import * as countryCodes from "country-codes-list";

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
  batch: string;
};

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

// Generate country list using country-codes-list package
const COUNTRY_LIST = countryCodes.customList(
  "countryCode",
  "{countryNameEn}"
);

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
  batch: "2",
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
    if (!form.full_name || !form.email || !form.country || !form.status || !form.experience || !form.comments || !form.payment_method || !form.payment_screenshot || !form.agreement) {
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
    const { error: uploadError } = await supabase.storage
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
        batch: form.batch,
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

  // Function to download course details
  const downloadCourseDetails = () => {
    // Open the PDF in a new tab
    window.open('/syllabus/dft.pdf', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-2 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-pulse delay-1500"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Course Description Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  DFT Analysis Crash Course
                </h1>
                <p className="text-sm text-gray-600">2nd Batch — Live + Recorded</p>
              </div>
            </div>
            <button
              onClick={downloadCourseDetails}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Download size={16} />
              Download Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span><span className="font-semibold">Duration:</span> 4 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span><span className="font-semibold">Dates:</span> 5th, 8th, 12th & 15th August 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span><span className="font-semibold">Time:</span> 5:00 PM (UTC+0)</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span><span className="font-semibold">Platform:</span> Zoom / Google Meet</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                <span><span className="font-semibold">Language:</span> English</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-pink-500" />
                <span><span className="font-semibold">Seats:</span> Limited to 20 Only</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Course Roadmap Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Course Roadmap</h3>
                  <p className="text-sm text-gray-600">From Basics to Advanced Post-Processing</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {[
                    "Introduction to DFT",
                    "Software & Molecular Setup", 
                    "Basis Sets & Functionals",
                    "Geometry Optimization",
                    "Frequency & Thermochemical Calculations"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-blue-200 hover:bg-white transition-all duration-300 group">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    "IR & Raman Spectra Simulation",
                    "HOMO–LUMO & Orbital Analysis",
                    "Reactivity Descriptors",
                    "Post-Processing Tools",
                    "Speed Up Your DFT Calculations"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-blue-200 hover:bg-white transition-all duration-300 group">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 6}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Join Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Why Join This Hands-On Course?</h3>
                  <p className="text-sm text-gray-600">Discover the benefits of our comprehensive DFT training</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {[
                    "Beginner-friendly — no prior experience needed",
                    "Software included for FREE (Gaussian, ORCA, Chimera, Avogadro)",
                    "Real project practice with tools used in publication-level research",
                    "Simulate & analyze: HOMO-LUMO, IR, Raman, MEP, Reactivity Descriptors"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-green-200 hover:bg-white transition-all duration-300 group">
                      <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    "Learn to write DFT results for journals with confidence",
                    "Get instructor support during live classes",
                    "Lifetime recording access",
                    "Digital certificate"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-green-200 hover:bg-white transition-all duration-300 group">
                      <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Register Button */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Ready to Get Started?</h3>
                  <p className="text-sm text-gray-600">Join the 2nd Batch and accelerate your DFT skills</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  const formElement = document.querySelector('form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Sparkles className="w-5 h-5" />
                Register Now
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="font-semibold mb-2 text-gray-800">Registration</div>
              <div className="text-sm text-gray-700 space-y-1">
                <p>📝 Register now: Scan QR in poster or DM us directly</p>
                <p>📩 Email: <a href="mailto:insilicology@gmail.com" className="text-purple-600 hover:underline">insilicology@gmail.com</a></p>
                <p>📲 WhatsApp: <a href="https://wa.me/+8801987718298" target="_blank" className="text-purple-600 hover:underline">+8801987718298</a></p>
                <p>🔗 Facebook: <a href="https://www.facebook.com/insilicology" target="_blank" className="text-purple-600 hover:underline">facebook.com/insilicology</a></p>
                <p>🌐 Website: <a href="https://www.insilicology.org" target="_blank" className="text-purple-600 hover:underline">www.insilicology.org</a></p>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
              🔥 Seats are filling fast — Don't miss the 2nd Batch!
              <br />
              #DFTWorkshop #InSilicology #QuantumChemistry #HOMOLUMO #FTIR #ComputationalChemistry #DrugDiscovery #DFTCourse #ChemTraining #OnlineChemistry #Gaussian #ORCA #ScientificComputing
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg mb-4">
                <Sparkles className="w-4 h-4" />
                DFT Course Registration
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Join the 2nd Batch
              </h2>
            </div>

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  Registration successful!
                </div>
                <p className="text-sm">We will contact you soon.</p>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">!</span>
                  </div>
                  {error}
                </div>
              </div>
            )}

            {/* Hidden batch field - locked to "2" */}
            <input type="hidden" name="batch" value={form.batch} />

            <div>
              <label className="block font-medium mb-2 text-gray-800">Full Name <RedStar /></label>
              <input 
                type="text" 
                name="full_name" 
                value={form.full_name} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-800">Email <RedStar /></label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
              />
            </div>

            {/* Row 1: Academic/Professional Status and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-gray-800">Academic/Professional Status <RedStar /></label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange} 
                  required 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select...</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {form.status === "Other" && (
                  <input 
                    type="text" 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange} 
                    placeholder="Please specify" 
                    className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                  />
                )}
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-800">Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="e.g., +880 1712345678"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +880 for Bangladesh, +91 for India)</p>
              </div>
            </div>

            {/* Row 2: Messenger and Telegram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-gray-800">Messenger</label>
                <input 
                  type="text" 
                  name="messenger" 
                  value={form.messenger} 
                  onChange={handleChange} 
                  placeholder="Facebook Messenger username"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-800">Telegram</label>
                <input 
                  type="text" 
                  name="telegram" 
                  value={form.telegram} 
                  onChange={handleChange} 
                  placeholder="Telegram username"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
            </div>

            {/* Row 3: Country, State, and City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-2 text-gray-800">Country <RedStar /></label>
                <select 
                  name="country" 
                  value={form.country} 
                  onChange={handleChange} 
                  required 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select your country...</option>
                  {Object.entries(COUNTRY_LIST).map(([code, name]) => (
                    <option key={code} value={name as string}>
                      {name as string}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-800">State</label>
                <input 
                  type="text" 
                  name="state" 
                  value={form.state} 
                  onChange={handleChange} 
                  placeholder="State/Province"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-800">City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange} 
                  placeholder="City"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-800">Have you used DFT or quantum software before? <RedStar /></label>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="experience" 
                    value="Yes" 
                    checked={form.experience === "Yes"} 
                    onChange={handleChange} 
                    required 
                    className="accent-purple-600" 
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="experience" 
                    value="No" 
                    checked={form.experience === "No"} 
                    onChange={handleChange} 
                    required 
                    className="accent-purple-600" 
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-800">What do you hope to gain from this course? <RedStar /></label>
              <textarea 
                name="comments" 
                value={form.comments} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                rows={3} 
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-800">Preferred Payment Method <RedStar /></label>
              <select 
                name="payment_method" 
                value={form.payment_method} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select...</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              {form.payment_method === "Other" && (
                <input 
                  type="text" 
                  name="paymentMethodOther" 
                  value={form.paymentMethodOther} 
                  onChange={handleChange} 
                  placeholder="Please specify" 
                  className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300" 
                />
              )}
            </div>

            {/* Payment Details Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Course Fee - $50</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-800 mb-1">UPI</div>
                  <div className="font-mono text-purple-600">9123799685@axisb</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800 mb-1">Paypal (int.)</div>
                  <div className="font-mono text-purple-600">hsifat14@gmail.com</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800 mb-1">Bkash</div>
                  <div className="font-mono text-purple-600">+8801994236422</div>
                </div>
              </div>
            </div>

            {/* Payment Screenshot Upload */}
            <div>
              <label className="block font-medium mb-2 text-gray-800">Payment Screenshot <RedStar /></label>
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                  form.payment_screenshot 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
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
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center justify-center">
                    <UploadCloud className="text-4xl text-purple-400 mb-3" />
                    <span className="text-gray-700">Drag & drop or <span className="text-purple-600 underline">browse</span> to upload</span>
                    <span className="text-xs text-gray-500 mt-2 block">PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, WEBP. Max 10MB.</span>
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

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreement"
                checked={form.agreement}
                onChange={handleChange}
                required
                className="mt-1 accent-purple-600"
              />
              <label className="text-sm font-medium text-gray-700">
                I understand this is a paid course and agree to receive payment details. <RedStar />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Submit Registration
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
