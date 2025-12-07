import { supabase } from '../lib/supabaseClient';
import type { Payment } from '../lib/database.types';

export interface CreatePaymentParams {
    amount: number;
    type: 'course_fee' | 'subscription' | 'teacher_payout';
    planName: string;
    currency?: string;
}

export interface PaymentResult {
    success: boolean;
    payment?: Payment;
    error?: string;
}

/**
 * Create a new payment record in Supabase
 * Uses auth.uid() from current session to match RLS policy
 */
export async function createPayment(
    params: CreatePaymentParams
): Promise<PaymentResult> {
    const { amount, type, planName, currency = 'USD' } = params;

    try {
        // Get the current authenticated user from Supabase session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated. Please sign in.' };
        }

        // Generate transaction ID
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

        const { data, error } = await supabase
            .from('payments')
            .insert({
                user_id: user.id, // Use Supabase auth user ID directly
                amount,
                currency,
                type,
                status: 'pending',
                transaction_id: transactionId,
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, payment: data };
    } catch (error: any) {
        console.error('Payment creation error:', error);
        return { success: false, error: error.message };
    }
}


/**
 * Update payment status (for admin approval)
 */
export async function updatePaymentStatus(
    paymentId: string,
    status: 'success' | 'failed' | 'pending'
): Promise<PaymentResult> {
    try {
        const { data, error } = await supabase
            .from('payments')
            .update({ status })
            .eq('id', paymentId)
            .select()
            .single();

        if (error) throw error;

        // If payment is successful, trigger email notification
        if (status === 'success' && data) {
            await sendPaymentConfirmationEmail(data);
        }

        return { success: true, payment: data };
    } catch (error: any) {
        console.error('Payment update error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get payment details configuration
 */
export async function getPaymentConfig() {
    const { data, error } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'paymentDetails')
        .single();

    if (error && error.code !== 'PGRST116') {
        throw error;
    }

    return data?.value || null;
}

/**
 * Update payment details configuration (admin only)
 */
export async function updatePaymentConfig(config: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
}) {
    const { error } = await supabase
        .from('system_config')
        .upsert({
            key: 'paymentDetails',
            value: config,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'key'
        });

    if (error) throw error;
    return true;
}

/**
 * Send payment confirmation email
 * Uses Supabase Edge Function or direct email service
 */
async function sendPaymentConfirmationEmail(payment: Payment) {
    try {
        // Get user profile for email
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, name')
            .eq('id', payment.user_id)
            .single();

        if (!profile?.email) return;

        // Call Supabase Edge Function for email
        const { error } = await supabase.functions.invoke('send-payment-email', {
            body: {
                to: profile.email,
                userName: profile.name,
                amount: payment.amount,
                currency: payment.currency,
                transactionId: payment.transaction_id,
                paymentDate: payment.created_at,
            },
        });

        if (error) {
            console.error('Failed to send email:', error);
            // Don't throw - email failure shouldn't break payment flow
        }
    } catch (error) {
        console.error('Email notification error:', error);
    }
}

/**
 * Get user's payment history
 */
export async function getPaymentHistory(userId: string) {
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Get all pending payments (admin)
 */
export async function getPendingPayments() {
    const { data, error } = await supabase
        .from('payments')
        .select(`
      *,
      profile:profiles(name, email)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}
