export interface DFTRegistration {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  messenger?: string;
  telegram?: string;
  country: string;
  state?: string;
  city?: string;
  status: string;
  experience: string;
  comments: string;
  payment_method: string;
  payment_screenshot_url: string;
  created_at: string;
  updated_at: string;
}

export interface DFTRegistrationFormData {
  full_name: string;
  email: string;
  phone: string;
  messenger: string;
  telegram: string;
  country: string;
  state: string;
  city: string;
  status: string;
  experience: string;
  comments: string;
  payment_method: string;
  paymentMethodOther: string;
  payment_screenshot: File | null;
  agreement: boolean;
}

export type DFTStatus = 'PhD' | 'MSc' | 'BSc' | 'Researcher' | 'Other';
export type DFTExperience = 'Yes' | 'No';
export type PaymentMethod = 'UPI' | 'Paypal' | 'Bkash' | 'Other'; 