"use client";

import { signupWithEmail } from "./actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Facebook, Linkedin } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignUp() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (form.password !== form.confirmPassword) {
      setPasswordError(true);
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    setPasswordError(false); // clear error if previously set
  
    startTransition(async () => {
      const { error } = await signupWithEmail(form);
      if (error) {
        toast.error(error.message || "Sorry, please try again");
      } else {
        toast.success("Account created successfully");
        router.push("/dashboard");
      }
    });
  };

  async function handleGoogleSignIn() {
    const supabase = createClientComponentClient();
    console.log("Trying to redirect to Google...");
  
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
  
    console.log("Redirect URL returned by Supabase:", `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`);
  
    if (error) {
      toast.error(error.message || "Sorry, please try again");
    }
  
    // OPTIONAL: manually force redirect if it's not happening automatically
    if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Scrollable form */}
      <div className="w-full h-full overflow-y-auto flex items-center justify-center bg-white p-8 md:p-16">
        <div className="w-full max-w-md py-8">
          <div className="mb-12 flex justify-center">
            <Image src="/logos/icon-insilicology.svg" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">Create an account</h2>

          <button
            onClick={handleGoogleSignIn}
            className="w-full cursor-pointer mt-4 bg-gray-100 hover:bg-gray-200 text-black font-medium py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Image src="/logos/logo-google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>

          <p className="text-gray-600 text-center mt-4">
            অথবা,
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold">Email</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <Mail className="text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleInput}
                  required
                  className="w-full p-3 bg-transparent focus:ring-0 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold">Password</label>
              <div className={`flex items-center bg-gray-100 rounded-lg px-3 relative ${passwordError ? "border-2 border-red-500" : ""}`}>
                <Lock className="text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleInput}
                  required
                  className="w-full p-3 bg-transparent focus:ring-0 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold">Confirm Password</label>
              <div className={`flex items-center bg-gray-100 rounded-lg px-3 relative ${passwordError ? "border-2 border-red-500" : ""}`}>
                <Lock className="text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={form.confirmPassword}
                  onChange={handleInput}
                  required
                  className="w-full p-3 bg-transparent focus:ring-0 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-lg"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 hover:underline font-semibold">
              Login
            </Link>
          </p>

          <div className="flex justify-center mt-16 space-x-4">
            <a href="https://www.facebook.com/skilltori" className="text-gray-800 hover:text-blue-600">
              <Facebook size={24} />
            </a>
            <a href="https://www.linkedin.com/company/skilltori" className="text-gray-800 hover:text-blue-500">
              <Linkedin size={24} />
            </a>
            {/* <a href="#" className="text-gray-800 hover:text-blue-400">
              <Twitter size={24} />
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
