"use client";

import React, { useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { useDropzone } from 'react-dropzone';

const DFT_COURSE_ID = 'DFT_COURSE_UUID'; // Replace with actual UUID if available

const experienceOptions = [
  'Beginner',
  'Some experience',
  'Advanced',
  'Researcher',
  'Other',
];

const statusOptions = [
  'PhD',
  'M.Phil',
  'MSc',
  'BSc',
  'Researcher',
  'Other',
];

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
  experience: string[];
  comments: string;
  payment_screenshot: File | null;
  agree: boolean;
  payment_method: string;
};

export default function DFTEnrollPage() {
  const [form, setForm] = useState<FormState>({
    full_name: '',
    email: '',
    phone: '',
    messenger: '',
    telegram: '',
    country: '',
    state: '',
    city: '',
    status: '',
    experience: [],
    comments: '',
    payment_screenshot: null,
    agree: false,
    payment_method: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [showOtherStatus, setShowOtherStatus] = useState(false);

  // Get all countries for dropdown
  const countries = Country.getAllCountries();
  const states = form.country ? State.getStatesOfCountry(form.country) : [];
  const cities = form.country && form.state ? City.getCitiesOfState(form.country, form.state) : [];

  // Dropzone for payment screenshot
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setForm((prev) => ({ ...prev, payment_screenshot: acceptedFiles[0] }));
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10 MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.heic'],
    },
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'experience') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        experience: checked
          ? [...prev.experience, value]
          : prev.experience.filter((exp) => exp !== value),
      }));
    } else if (type === 'checkbox' && name === 'agree') {
      setForm((prev) => ({ ...prev, agree: (e.target as HTMLInputElement).checked }));
    } else if (type === 'file' && name === 'payment_screenshot') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm((prev) => ({ ...prev, payment_screenshot: file }));
    } else {
      // Reset state and city if country changes
      if (name === 'country') {
        setForm((prev) => ({ ...prev, country: value, state: '', city: '' }));
        return;
      }
      // Reset city if state changes
      if (name === 'state') {
        setForm((prev) => ({ ...prev, state: value, city: '' }));
        return;
      }
      setForm((prev) => ({ ...prev, [name]: value }));
      // Show/hide other status input based on selection
      if (name === 'status') {
        setShowOtherStatus(value === 'Other');
      }
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Enrollment Submitted!</h2>
          <p className="text-gray-700">Thank you for enrolling in the DFT Hands-On DFT Analysis Crash Course. We will contact you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Enroll in DFT Hands-On DFT Analysis Crash Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow border border-gray-200">
        {/* Course (preselected) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Course</label>
          <select disabled className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition">
            <option value={DFT_COURSE_ID}>DFT Hands-On DFT Analysis Crash Course</option>
          </select>
        </div>
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input type="text" name="full_name" required value={form.full_name} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        {/* Messenger */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Messenger</label>
          <input type="text" name="messenger" value={form.messenger} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        {/* Telegram */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Telegram</label>
          <input type="text" name="telegram" value={form.telegram} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        {/* Country */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select name="country" value={form.country} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition">
            <option value="">Select a country</option>
            {countries.map((country: ICountry) => (
              <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
            ))}
          </select>
        </div>
        {/* State */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">State</label>
          <input type="text" name="state" value={form.state} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        {/* City */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">City</label>
          <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        {/* Academic/Professional Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Academic/Professional Status <span className="text-red-500">*</span>
          </label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition">
            <option value="">Select your status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {showOtherStatus && (
            <input type="text" name="status" placeholder="Please specify your status" value={form.status === 'Other' ? '' : form.status} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
          )}
        </div>
        {/* Experience (multi-checkbox) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Experience</label>
          <div className="flex flex-wrap gap-4">
            {experienceOptions.map((exp) => (
              <label key={exp} className="flex items-center gap-2">
                <input type="checkbox" name="experience" value={exp} checked={form.experience.includes(exp)} onChange={handleChange} className="accent-amber-500 rounded border border-gray-300 focus:ring-amber-400" />
                <span>{exp}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Comments */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Comments</label>
          <textarea name="comments" value={form.comments} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" rows={3} />
        </div>
        {/* Payment Agreement and Method */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-2">
          <label className="block text-gray-700 font-medium mb-2">
            I understand this is a paid course and agree to receive payment details. <span className="text-red-500">*</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="accent-amber-500 rounded border border-gray-300 focus:ring-amber-400"
              required
            />
            <span className="text-gray-700 font-medium">Yes, I agree</span>
          </label>
          <div className="mt-4">
            <div className="text-gray-700 font-medium mb-1">Preferred Payment Method</div>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              required
            >
              <option value="">Select a payment method</option>
              <option value="UPI">UPI</option>
              <option value="Paypal">Paypal</option>
              <option value="Bkash">Bkash</option>
            </select>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            <div className="mb-1 font-semibold">Course Fee - $50 <span className="text-red-500">*</span></div>
            <div className="mb-1"><span className="font-medium">UPI ID:</span> 9123799685@axisb</div>
            <div className="mb-1"><span className="font-medium">Paypal (int.):</span> hsifat14@gmail.com</div>
            <div className="mb-1"><span className="font-medium">Bkash:</span> +8801994236422</div>
          </div>
        </div>
        {/* Payment Screenshot Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Payment Screenshot (optional)</label>
          <div
            {...getRootProps({
              className:
                'flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-8 cursor-pointer transition ' +
                (isDragActive ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white') +
                (isDragReject ? ' border-red-500' : ''),
            })}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-amber-400 mb-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 0l-3 3m3-3l3 3m-9 4v4a2 2 0 002 2h10a2 2 0 002-2v-4" /></svg>
              <span className="text-gray-600 text-sm">Drag & drop file here, or <span className="text-amber-500 underline">browse</span></span>
              <span className="text-xs text-gray-500">PDF, document, image, or presentation. Max 10 MB.</span>
            </div>
          </div>
          {form.payment_screenshot && (
            <div className="mt-2 text-green-700 text-sm">Selected: {form.payment_screenshot.name}</div>
          )}
          {isDragReject && (
            <div className="mt-2 text-red-600 text-xs">File type not accepted or file is too large.</div>
          )}
        </div>
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg shadow transition cursor-pointer">Submit</button>
      </form>
    </div>
  );
} 