'use server'

import { createClient } from '@/utils/supabase/server'

export async function signupWithEmail({
  email,
  password,
}: {
  email: string
  password: string
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (err: unknown) {
    console.error("Signup error:", err)

    return {
      error: {
        message: "সাইনআপ করতে সমস্যা হয়েছে। দয়া করে একটু পর চেষ্টা করুন।",
      },
    }
  }
}
