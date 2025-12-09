// @ts-nocheck - This is a Deno/Supabase Edge Function, not Node.js
// Supabase Edge Function for sending payment confirmation emails
// Deploy with: npx supabase functions deploy send-payment-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface PaymentEmailRequest {
  to: string
  userName: string
  amount: number
  currency: string
  transactionId: string
  paymentDate: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { to, userName, amount, currency, transactionId, paymentDate }: PaymentEmailRequest = await req.json()

    if (!to || !userName || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const formattedDate = new Date(paymentDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmed</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎵 Jay Music Academy</h1>
              <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">Payment Confirmed!</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1a1a2e; margin-top: 0;">Dear ${userName},</h2>
              
              <p style="color: #4a5568; line-height: 1.6;">
                Great news! Your payment has been successfully processed and confirmed.
              </p>
              
              <div style="background: #f7fafc; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #667eea;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #718096;">Amount:</td>
                    <td style="padding: 8px 0; color: #1a1a2e; font-weight: bold; text-align: right;">
                      ${currency} ${amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #718096;">Transaction ID:</td>
                    <td style="padding: 8px 0; color: #1a1a2e; font-family: monospace; text-align: right; font-size: 12px;">
                      ${transactionId}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #718096;">Date:</td>
                    <td style="padding: 8px 0; color: #1a1a2e; text-align: right;">
                      ${formattedDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #718096;">Status:</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="background: #48bb78; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                        ✓ CONFIRMED
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #4a5568; line-height: 1.6;">
                Your account has been activated with full access to your subscribed plan. 
                Start exploring our courses and begin your musical journey today!
              </p>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="https://jaymusicacademy.com/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; 
                          font-weight: bold; font-size: 16px;">
                  Go to Dashboard →
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              
              <p style="color: #a0aec0; font-size: 14px; text-align: center; margin: 0;">
                Thank you for choosing Jay Music Academy.<br>
                If you have any questions, contact us at <a href="mailto:support@jaymusicacademy.com" style="color: #667eea;">support@jaymusicacademy.com</a>
              </p>
            </div>
            
            <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 24px;">
              © ${new Date().getFullYear()} Jay Music Academy. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `

    // Send email via Resend
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Jay Music Academy <noreply@jaymusicacademy.com>',
          to: [to],
          subject: `✓ Payment Confirmed - ${currency} ${amount.toFixed(2)}`,
          html: emailHtml,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Resend API error:', data)
        return new Response(
          JSON.stringify({ error: 'Failed to send email', details: data }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, messageId: data.id }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    } else {
      // Log email for development/testing
      console.log('Email would be sent to:', to)
      console.log('Email content:', { userName, amount, currency, transactionId, paymentDate })

      return new Response(
        JSON.stringify({ success: true, message: 'Email logged (no API key configured)' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }
  } catch (error) {
    console.error('Email function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
