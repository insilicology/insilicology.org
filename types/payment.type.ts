export interface Payment {
    id: string
    user_id: string
    amount: number
    currency: string
    method: string
    reference?: string
    notes?: string
    received_at: string
    created_at: string
    updated_at: string
  }