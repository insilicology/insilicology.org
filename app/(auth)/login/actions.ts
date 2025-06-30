// actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function loginWithEmail({
  email,
  password,
}: {
  email: string
  password: string
}) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: { message: error.message }, role: null };
    }

    // ✅ Fetch user's role
    const {
      data: userInfo,
      error: userError
    } = await supabase.from('users').select('role').eq('id', data.user.id).single();

    if (userError) {
      return { error: { message: userError.message }, role: null };
    }

    return { error: null, role: userInfo.role };
  } catch (err: unknown) {
    console.error("Login error:", err);
    return {
      error: {
        message: "আপনার ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।",
      },
      role: null,
    };
  }
}

export async function signInWithGoogle() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) return { error: { message: error.message }, redirectUrl: null };

    return { error: null, redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` };
  } catch (err) {
    console.error("Google Auth Error:", err);
    return {
      error: {
        message: "Google সাইন-ইন/আপে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      },
      redirectUrl: null,
    };
  }
}
