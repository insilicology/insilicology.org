'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { KeyRound } from 'lucide-react';
import EditUserModal from './EditUserModal';
import { toast } from 'react-hot-toast';

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  gender: string | null;
  country: string | null;
  whatsapp: string | null;
  facebook: string | null;
  telegram: string | null;
  role: string;
};

export default function AccountPage() {
  const supabase = createClientComponentClient();
  
  const [user, setUser] = useState<PublicUser | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUserData() {
      try {
        setLoading(true);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            toast.error("Authentication error");
            setLoading(false);
            setAuthLoading(false);
          }
          return;
        }

        if (session?.user) {
          console.log('Fetching user data for:', session.user.email);
          
          // Try to fetch from users table first
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('User data fetch error:', userError);
            
            // If RLS error, create a fallback user object from session
            if (userError.code === '42P17' || userError.message.includes('infinite recursion')) {
              console.log('RLS error detected, using session fallback');
              const fallbackUser: PublicUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
                gender: null,
                country: null,
                whatsapp: null,
                facebook: null,
                telegram: null,
                role: 'user'
              };
              
              if (mounted) {
                setUser(fallbackUser);
                setLoading(false);
                setAuthLoading(false);
              }
              return;
            }
            
            if (mounted) {
              toast.error("User data fetch failed");
              setLoading(false);
              setAuthLoading(false);
            }
            return;
          }

          console.log('User data retrieved:', userData);
          
          if (mounted) {
            setUser(userData);
            setLoading(false);
            setAuthLoading(false);
          }
        } else {
          if (mounted) {
            setUser(null);
            setLoading(false);
            setAuthLoading(false);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        if (mounted) {
          toast.error("Failed to load user data");
          setLoading(false);
          setAuthLoading(false);
        }
      }
    }

    loadUserData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);

        try {
          if (session?.user) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError) {
              console.error('Auth state change user fetch error:', userError);
              
              // If RLS error, create a fallback user object from session
              if (userError.code === '42P17' || userError.message.includes('infinite recursion')) {
                console.log('RLS error detected in auth change, using session fallback');
                const fallbackUser: PublicUser = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
                  gender: null,
                  country: null,
                  whatsapp: null,
                  facebook: null,
                  telegram: null,
                  role: 'user'
                };
                
                if (mounted) {
                  setUser(fallbackUser);
                }
                return;
              }
              
              toast.error("User data fetch failed");
              if (mounted) {
                setUser(null);
              }
            } else {
              console.log('Auth state change - user data:', userData);
              if (mounted) {
                setUser(userData);
              }
            }
          } else {
            if (mounted) {
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
            setAuthLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmNewPassword') as HTMLInputElement).value;
  
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters.');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match.');
    }
  
    setLoading(true);
  
    try {
      // Re-authenticate to verify old password
      const { data: session } = await supabase.auth.getSession();
      const email = session?.session?.user?.email;
    
      if (!email) {
        setLoading(false);
        return toast.error('User not authenticated.');
      }
    
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
    
      if (signInError) {
        setLoading(false);
        return toast.error('Current password is incorrect.');
      }
    
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
    
      if (error) {
        toast.error('Failed to update password.');
      } else {
        toast.success('Password updated successfully!');
        setShowPasswordForm(false);
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('An error occurred while updating password.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="p-2 md:p-4 mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!user) {
    return (
      <div className="p-2 md:p-4 mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔐</div>
          <p className="text-gray-600 mb-2 text-lg font-medium">Please log in</p>
          <p className="text-sm text-gray-500 mb-6">Login to view your account information</p>
          <a 
            href="/login" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors shadow-sm"
          >
            Login Now
          </a>
        </div>
      </div>
    );
  }

  console.log('Rendering account page with user:', user);

  return (
    <div className="p-2 md:p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">My Account</h1>
        <EditUserModal user={user} />
      </div>

      <div className="grid grid-cols-1 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {[
          { label: 'Name', value: user?.name },
          { label: 'Email', value: user?.email },
          { label: 'Gender', value: user?.gender },
          { label: 'Country', value: user?.country },
          { label: 'WhatsApp', value: user?.whatsapp },
          { label: 'Facebook', value: user?.facebook },
          { label: 'Telegram', value: user?.telegram },
        ].map((field) => (
          <div key={field.label}>
            <div className="text-sm font-semibold text-gray-600">{field.label}</div>
            <div className="mt-1 text-base text-gray-900">{field.value || '-'}</div>
          </div>
        ))}
      </div>

      {/* Change Password */}
      <div className="mt-10">
        <button
          onClick={() => setShowPasswordForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          <KeyRound size={16} />
          {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
        </button>

        {showPasswordForm && (
          <form
            onSubmit={handlePasswordChange}
            className="mt-6 grid gap-4 bg-white p-6 rounded-xl shadow-sm border max-w-xl"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
