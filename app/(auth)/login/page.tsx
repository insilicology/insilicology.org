"use client";

import { loginWithEmail } from "./actions";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Facebook, Linkedin } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
  
      if (session) {
        const {
          data: userInfo
        } = await supabase.from('users').select('role').eq('id', session.user.id).single();
  
        if (userInfo?.role === 'admin') {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      }
    };
  
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const {
            data: userInfo
          } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    
          if (userInfo?.role === 'admin') {
            router.replace("/admin");
          } else {
            router.replace("/dashboard");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { error, role } = await loginWithEmail(form);
  
      if (error) {
        toast.error(error.message || "Sorry, please try again");
      } else {
        toast.success("Login successful");
  
        if (role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
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
  
    console.log("Redirect URL returned by Supabase:", data?.url);
  
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
      {/* Left - Scrollable Form */}
      <div className="w-full h-full overflow-y-auto flex items-center justify-center bg-white p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-12 flex justify-center">
            <Image src="/logos/icon-insilicology.svg" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
            Login
          </h2>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-google w-full cursor-pointer mt-4 bg-gray-100 hover:bg-gray-200 text-black font-medium py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Image src="/logos/logo-google.svg" alt="Google" width={20} height={20} />
            Sign in with Google
          </button>

          <p className="text-gray-600 text-center mt-4">
            Or,
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
              <div className="flex items-center bg-gray-100 rounded-lg px-3 relative">
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-lg"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            No account?{" "}
            <Link href="/signup" className="text-amber-400 hover:underline font-semibold">
              Create an account
            </Link>
          </p>

          <div className="flex justify-center mt-16 space-x-4">
            <a href="https://www.facebook.com/insilicology" className="text-gray-800 hover:text-blue-600">
              <Facebook size={24} />
            </a>
            <a href="https://www.linkedin.com/company/insilicology" className="text-gray-800 hover:text-blue-500">
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
