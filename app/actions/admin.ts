'use server'

import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'zentechservices62@gmail.com'
const OTP_EXPIRY_MINUTES = 5

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email (using Resend)
async function sendOTPEmail(email: string, otp: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Zentech Services <onboarding@resend.dev>',
        to: email,
        subject: 'Your Admin Access OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Admin Access Verification</h2>
            <p>Your One-Time Password (OTP) for admin access is:</p>
            <div style="background: #f5f5f3; padding: 20px; text-align: center; margin: 20px 0; border-radius: 4px;">
              <h1 style="margin: 0; letter-spacing: 5px; color: #1a1a18;">${otp}</h1>
            </div>
            <p>This OTP will expire in 5 minutes.</p>
            <p style="color: #6b6b69; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      console.error('Failed to send OTP email:', await response.text())
      throw new Error('Failed to send OTP')
    }
    return true
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw error
  }
}

// Request OTP
export async function requestAdminOTP(email: string) {
  // Verify it's the admin email
  if (email !== ADMIN_EMAIL) {
    throw new Error('Access denied. Invalid email.')
  }

  try {
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    // Save OTP to database
    await db.execute(
      sql`INSERT INTO admin_otp (email, otp, expires_at) VALUES (${email}, ${otp}, ${expiresAt})`
    )

    // Send OTP via email
    await sendOTPEmail(email, otp)

    return { success: true, message: 'OTP sent to your email' }
  } catch (error) {
    console.error('Error requesting OTP:', error)
    throw new Error('Failed to request OTP')
  }
}

// Verify OTP and create session
export async function verifyAdminOTP(email: string, otp: string) {
  if (email !== ADMIN_EMAIL) {
    throw new Error('Access denied. Invalid email.')
  }

  try {
    // Check if OTP exists and is valid
    const result = await db.execute(
      sql`SELECT * FROM admin_otp WHERE email = ${email} AND otp = ${otp} AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`
    )

    if (result.rows.length === 0) {
      throw new Error('Invalid or expired OTP')
    }

    // Delete used OTP
    await db.execute(
      sql`DELETE FROM admin_otp WHERE email = ${email} AND otp = ${otp}`
    )

    // Create session
    const sessionToken = generateOTP() + Date.now()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await db.execute(
      sql`INSERT INTO admin_sessions (email, session_token, expires_at) VALUES (${email}, ${sessionToken}, ${expiresAt}) ON CONFLICT (email) DO UPDATE SET session_token = ${sessionToken}, expires_at = ${expiresAt}`
    )

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return { success: true, message: 'Admin access granted' }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

// Check if user is admin
export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    const result = await db.execute(
      sql`SELECT * FROM admin_sessions WHERE session_token = ${sessionToken} AND expires_at > NOW() LIMIT 1`
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}

// Logout admin
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin-login')
}
