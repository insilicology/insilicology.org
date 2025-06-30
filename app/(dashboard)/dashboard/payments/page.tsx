'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { CreditCard, Calendar, DollarSign, Receipt } from 'lucide-react'
import { Payment } from '@/types/payment.type'

export default function PaymentsPage() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
          if (mounted) {
            setError('Authentication error')
            setLoading(false)
            setAuthLoading(false)
          }
          return
        }

        if (session?.user) {
          setUser(session.user)
          await fetchUserPayments(session.user.id)
        } else {
          setUser(null)
          setPayments([])
        }
      } catch (err) {
        console.error('Error loading data:', err)
        if (mounted) {
          setError('Failed to load data')
          setLoading(false)
          setAuthLoading(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          setAuthLoading(false)
        }
      }
    }

    loadData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        try {
          if (session?.user) {
            setUser(session.user)
            await fetchUserPayments(session.user.id)
          } else {
            setUser(null)
            setPayments([])
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
          setPayments([])
        } finally {
          if (mounted) {
            setLoading(false)
            setAuthLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false;
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  async function fetchUserPayments(userId: string) {
    try {
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('received_at', { ascending: false })

      if (error) {
        console.error('Error fetching payments:', error)
        setError('Failed to load payments')
        return
      }

      setPayments(payments || [])
    } catch (err) {
      console.error('Error in fetchUserPayments:', err)
      setError('Failed to load payments')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (err) {
      console.error('Error in formatDate:', err)
      return 'Invalid date'
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'stripe':
        return '💳'
      case 'paypal':
        return '🔵'
      case 'bank':
        return '🏦'
      default:
        return '💰'
    }
  }

  const getTotalAmount = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0)
  }

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl shadow-sm"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔐</div>
          <p className="text-gray-600 mb-2 text-lg font-medium">Please log in</p>
          <p className="text-sm text-gray-500 mb-6">Login to view your payment history</p>
          <a 
            href="/login" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors shadow-sm"
          >
            Login Now
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">Track all your payment transactions</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-600">
            {formatAmount(getTotalAmount(), 'USD')}
          </div>
          <div className="text-sm text-gray-500">Total Payments</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Receipt className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(getTotalAmount(), 'USD')}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Latest Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.length > 0 ? formatDate(payments[0].received_at) : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-6xl mb-4">💳</div>
          <p className="text-gray-600 mb-2 text-lg font-medium">No payments found</p>
          <p className="text-sm text-gray-500 mb-6">Your payment history will appear here</p>
          <a 
            href="/courses" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <span className="text-2xl">{getMethodIcon(payment.method.toUpperCase())}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)} Payment
                      </h3>
                      {payment.reference && (
                        <p className="text-sm text-gray-500">
                          Ref: {payment.reference}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-600">
                      {formatAmount(payment.amount, payment.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(payment.received_at)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Received: {formatDate(payment.received_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>Method: {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>Currency: {payment.currency.toUpperCase()}</span>
                  </div>
                </div>

                {payment.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {payment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
