'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
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

export async function createContact(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  const userId = await getUserId()
  
  const result = await db
    .insert(contacts)
    .values({
      ...data,
      userId,
    })
    .returning()

  // Send confirmation email to customer
  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: 'Zentech Services <noreply@zentech.com>',
      to: data.email,
      subject: 'We received your message',
      html: `
        <h2>Thank you for contacting us</h2>
        <p>Hi ${data.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p>Best regards,<br>Zentech Services Team</p>
      `,
    })

    // Send admin notification
    await resend.emails.send({
      from: 'Zentech Services <noreply@zentech.com>',
      to: 'admin@zentech.com',
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    })
  }

  revalidatePath('/admin/contacts')
  return result[0]
}

export async function getContacts() {
  const userId = await getUserId()
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.createdAt))
}

export async function updateContactStatus(contactId: number, status: string) {
  const userId = await getUserId()
  
  const result = await db
    .update(contacts)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
    .returning()

  revalidatePath('/admin/contacts')
  return result[0]
}

export async function deleteContact(contactId: number) {
  const userId = await getUserId()
  
  await db
    .delete(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))

  revalidatePath('/admin/contacts')
}
