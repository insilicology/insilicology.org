import { supabaseAdmin } from "@/lib/supabase/server";

export interface PaymentRecord {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  currency: string;
  payment_channel: string;
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  transaction_id: string;
  bkash_payment_id?: string;
  bkash_url?: string;
  is_verified: boolean;
  paid_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface PaymentWithCourse extends PaymentRecord {
  course: {
    id: string;
    title: string;
    slug: string;
    type: string;
    duration: string;
    price_offer: string;
    poster: string;
  };
}

export interface UserEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  course: {
    id: string;
    title: string;
    slug: string;
    type: string;
    duration: string;
    price_offer: string;
    poster: string;
    description: string;
  };
}

export async function createPaymentRecord(data: {
  user_id: string;
  course_id: string;
  amount: number;
  payment_channel: string;
  transaction_id: string;
}): Promise<PaymentRecord | null> {
  try {
    console.log('Creating payment record with data:', data);
    
    const paymentData = {
      user_id: data.user_id,
      course_id: data.course_id,
      amount: data.amount,
      currency: 'BDT',
      payment_channel: data.payment_channel,
      status: 'pending' as const,
      transaction_id: data.transaction_id,
      is_verified: false,
      created_at: new Date().toISOString()
    };

    console.log('Payment data to insert:', paymentData);

    const { data: paymentRecord, error } = await supabaseAdmin
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment record:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    console.log('Payment record created successfully:', paymentRecord);
    return paymentRecord;
  } catch (error) {
    console.error('Error in createPaymentRecord:', error);
    return null;
  }
}

export async function updatePaymentRecord(
  paymentId: string,
  updates: Partial<PaymentRecord>
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('payments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (error) {
      console.error('Error updating payment record:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePaymentRecord:', error);
    return false;
  }
}

export async function findPaymentByBkashId(bkashPaymentId: string): Promise<PaymentRecord | null> {
  try {
    const { data: paymentRecord, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('bkash_payment_id', bkashPaymentId)
      .single();

    if (error) {
      console.error('Error finding payment by bKash ID:', error);
      return null;
    }

    return paymentRecord;
  } catch (error) {
    console.error('Error in findPaymentByBkashId:', error);
    return null;
  }
}

export async function getUserPayments(userId: string): Promise<PaymentWithCourse[]> {
  try {
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select(`
        *,
        course:course_id (
          id,
          title,
          slug,
          type,
          duration,
          price_offer,
          poster
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user payments:', error);
      return [];
    }

    return payments || [];
  } catch (error) {
    console.error('Error in getUserPayments:', error);
    return [];
  }
}

export async function getUserEnrolledCourses(userId: string): Promise<UserEnrollment[]> {
  try {
    const { data: enrollments, error } = await supabaseAdmin
      .from('user_courses')
      .select(`
        *,
        course:course_id (
          id,
          title,
          slug,
          type,
          duration,
          price_offer,
          poster,
          description
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error getting user enrollments:', error);
      return [];
    }

    return enrollments || [];
  } catch (error) {
    console.error('Error in getUserEnrolledCourses:', error);
    return [];
  }
}

export async function isUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
  try {
    const { data: enrollment } = await supabaseAdmin
      .from('user_courses')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    return !!enrollment;
  } catch (error) {
    console.error('Error in isUserEnrolledInCourse:', error);
    return false;
  }
}

export async function enrollUserInCourse(userId: string, courseId: string): Promise<boolean> {
  try {
    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabaseAdmin
      .from('user_courses')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      console.log('User already enrolled in course');
      return true;
    }

    // Enroll user in course
    const { error } = await supabaseAdmin
      .from('user_courses')
      .insert({
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString()
      })
      .single();

    if (error) {
      console.error('Error enrolling user in course:', error);
      return false;
    }

    console.log('User enrolled in course successfully');
    return true;
  } catch (error) {
    console.error('Error in enrollUserInCourse:', error);
    return false;
  }
}

export async function processSuccessfulPayment(
  paymentRecord: PaymentRecord,
  bkashPaymentId: string
): Promise<boolean> {
  try {
    // Update payment record to successful with bKash payment ID
    const paymentUpdated = await updatePaymentRecord(paymentRecord.id, {
      status: 'successful',
      paid_at: new Date().toISOString(),
      is_verified: true,
      bkash_payment_id: bkashPaymentId
    });

    if (!paymentUpdated) {
      console.error('Failed to update payment record');
      return false;
    }

    // Enroll user in course
    const enrollmentSuccessful = await enrollUserInCourse(
      paymentRecord.user_id,
      paymentRecord.course_id
    );

    if (!enrollmentSuccessful) {
      console.error('Failed to enroll user in course');
      // Don't fail the payment if enrollment fails, just log it
    }

    return true;
  } catch (error) {
    console.error('Error in processSuccessfulPayment:', error);
    return false;
  }
}

export async function processFailedPayment(
  paymentRecord: PaymentRecord
): Promise<boolean> {
  try {
    const updated = await updatePaymentRecord(paymentRecord.id, {
      status: 'failed'
    });

    return updated;
  } catch (error) {
    console.error('Error in processFailedPayment:', error);
    return false;
  }
} 