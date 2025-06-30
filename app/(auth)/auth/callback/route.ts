// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  const supabase = createRouteHandlerClient({ cookies })

  if (!code) {
    // No code = redirect to home
    return NextResponse.redirect(process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin)
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth session exchange failed:', error.message)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin}/auth/auth-code-error`
    )
  }

  // Get user session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
    try {
      // Check if user exists in our users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', session.user.id)
        .single()

      // If user doesn't exist, create them
      if (!existingUser && !userError) {
        console.log('Creating new user record for:', session.user.email)
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.display_name || 
                  session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name || 
                  session.user.email,
            role: 'user'
          })

        if (insertError) {
          console.error('Error creating user record:', insertError)
          // Don't fail the auth process, just log the error
        } else {
          console.log('User record created successfully')
        }
      } else if (userError && userError.code === 'PGRST116') {
        // User not found, create them
        console.log('User not found, creating new user record for:', session.user.email)
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.display_name || 
                  session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name || 
                  session.user.email,
            role: 'user'
          })

        if (insertError) {
          console.error('Error creating user record:', insertError)
        } else {
          console.log('User record created successfully')
        }
      }

      // Get user role to determine redirect (after ensuring user exists)
      const { data: userInfo } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      let redirectPath = next

      // Admins always go to /admin
      if (userInfo?.role === 'admin') {
        redirectPath = '/admin'
      }

      const isLocal = process.env.NODE_ENV === 'development'

      const finalRedirectUrl = isLocal
        ? `${requestUrl.origin}${redirectPath}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}${redirectPath}`

      return NextResponse.redirect(finalRedirectUrl)
    } catch (error) {
      console.error('Error in auth callback:', error)
      // Fallback redirect even if there's an error
      return NextResponse.redirect(process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin)
    }
  }

  // Fallback redirect
  return NextResponse.redirect(process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin)
}
