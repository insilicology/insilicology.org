import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'

export interface PublicUser {
  id: string
  email: string
  name: string | null
  gender: string | null
  country: string | null
  whatsapp: string | null
  facebook: string | null
  telegram: string | null
  role: string
}

/**
 * Ensures a user record exists in the users table
 * Creates the user if they don't exist
 */
export async function ensureUserExists(authUser: User): Promise<PublicUser | null> {
  const supabase = createClientComponentClient()

  try {
    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (existingUser) {
      return existingUser
    }

    // User doesn't exist, create them
    if (userError && userError.code === 'PGRST116') {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.display_name || 
                authUser.user_metadata?.full_name || 
                authUser.user_metadata?.name || 
                authUser.email,
          role: 'user'
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user:', insertError)
        return null
      }

      return newUser
    }

    return null
  } catch (error) {
    console.error('Error in ensureUserExists:', error)
    return null
  }
}

/**
 * Fetches user data with automatic creation if needed
 */
export async function fetchUserData(): Promise<PublicUser | null> {
  const supabase = createClientComponentClient()

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return null
    }

    // Try to fetch existing user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (user) {
      return user
    }

    // User doesn't exist, create them
    if (userError && userError.code === 'PGRST116') {
      return await ensureUserExists(session.user)
    }

    return null
  } catch (error) {
    console.error('Error in fetchUserData:', error)
    return null
  }
}

/**
 * Updates user profile data
 */
export async function updateUserProfile(userId: string, updates: Partial<PublicUser>): Promise<boolean> {
  const supabase = createClientComponentClient()

  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user profile:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateUserProfile:', error)
    return false
  }
} 