'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { affiliates, referrals, affiliateWithdrawals, orders } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createAffiliateApplication(data: {
  name: string
  email: string
  phone?: string
  website?: string
  bankDetails?: string
}) {
  // Generate referral code
  const referralCode = `ZEN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
  const result = await db
    .insert(affiliates)
    .values({
      ...data,
      referralCode,
      status: 'pending',
    })
    .returning()

  // Send confirmation email
  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: 'Zentech Services <noreply@zentech.com>',
      to: data.email,
      subject: 'Affiliate Application Received',
      html: `
        <h2>Thank you for applying to our affiliate program!</h2>
        <p>Hi ${data.name},</p>
        <p>We have received your application and will review it shortly.</p>
        <p>You will receive another email once your application is approved.</p>
        <p>Best regards,<br>Zentech Services Team</p>
      `,
    })

    // Send admin notification
    await resend.emails.send({
      from: 'Zentech Services <noreply@zentech.com>',
      to: 'admin@zentech.com',
      subject: 'New Affiliate Application',
      html: `
        <h2>New Affiliate Application</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Website:</strong> ${data.website || 'Not provided'}</p>
        <p><strong>Referral Code:</strong> ${referralCode}</p>
      `,
    })
  }

  revalidatePath('/admin/affiliates')
  return result[0]
}

export async function getAffiliates() {
  const userId = await getUserId()
  return db
    .select()
    .from(affiliates)
    .where(eq(affiliates.userId, userId))
    .orderBy(desc(affiliates.createdAt))
}

export async function updateAffiliateStatus(affiliateId: number, status: string) {
  const userId = await getUserId()
  
  const result = await db
    .update(affiliates)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(affiliates.id, affiliateId), eq(affiliates.userId, userId)))
    .returning()

  if (status === 'approved' && result[0]) {
    // Send approval email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Zentech Services <noreply@zentech.com>',
        to: result[0].email,
        subject: 'Your Affiliate Application has been Approved!',
        html: `
          <h2>Congratulations!</h2>
          <p>Your affiliate application has been approved.</p>
          <p><strong>Your Referral Code:</strong> ${result[0].referralCode}</p>
          <p><strong>Commission Rate:</strong> ${result[0].commissionRate}%</p>
          <p>Start sharing your unique referral code to earn commissions!</p>
          <p>Best regards,<br>Zentech Services Team</p>
        `,
      })
    }
  }

  revalidatePath('/admin/affiliates')
  return result[0]
}

export async function createReferral(data: {
  affiliateId: number
  orderId: number
  commissionAmount: number
}) {
  const result = await db
    .insert(referrals)
    .values({
      ...data,
      status: 'pending',
    })
    .returning()

  revalidatePath('/admin/referrals')
  return result[0]
}

export async function getReferrals() {
  const userId = await getUserId()
  
  // Get affiliates belonging to the user
  const userAffiliates = await db
    .select({ id: affiliates.id })
    .from(affiliates)
    .where(eq(affiliates.userId, userId))

  const affiliateIds = userAffiliates.map(a => a.id)
  
  if (affiliateIds.length === 0) return []

  return db
    .select()
    .from(referrals)
    .where(affiliates.id.inArray(affiliateIds))
    .orderBy(desc(referrals.createdAt))
}

export async function requestWithdrawal(affiliateId: number, amount: number, bankDetails: string) {
  const userId = await getUserId()
  
  // Verify affiliate belongs to user
  const affiliate = await db
    .select()
    .from(affiliates)
    .where(and(eq(affiliates.id, affiliateId), eq(affiliates.userId, userId)))
    .limit(1)

  if (!affiliate.length) throw new Error('Unauthorized')

  const result = await db
    .insert(affiliateWithdrawals)
    .values({
      affiliateId,
      amount,
      bankDetails,
      status: 'pending',
    })
    .returning()

  // Send notification email
  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: 'Zentech Services <noreply@zentech.com>',
      to: 'admin@zentech.com',
      subject: `Withdrawal Request from Affiliate`,
      html: `
        <h2>New Withdrawal Request</h2>
        <p><strong>Affiliate:</strong> ${affiliate[0].name}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Status:</strong> Pending</p>
      `,
    })
  }

  revalidatePath('/admin/withdrawals')
  return result[0]
}

export async function getWithdrawals() {
  const userId = await getUserId()
  
  const userAffiliates = await db
    .select({ id: affiliates.id })
    .from(affiliates)
    .where(eq(affiliates.userId, userId))

  const affiliateIds = userAffiliates.map(a => a.id)
  
  if (affiliateIds.length === 0) return []

  return db
    .select()
    .from(affiliateWithdrawals)
    .where(affiliateWithdrawals.affiliateId.inArray(affiliateIds))
    .orderBy(desc(affiliateWithdrawals.createdAt))
}
