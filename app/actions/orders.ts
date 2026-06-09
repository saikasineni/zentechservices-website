'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
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

export async function createOrder(data: {
  serviceId: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  description?: string
  totalPrice: string
}) {
  const userId = await getUserId()
  
  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
  const result = await db
    .insert(orders)
    .values({
      ...data,
      orderNumber,
      userId,
      totalPrice: parseFloat(data.totalPrice),
    })
    .returning()

  // Send email notification
  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: 'Zentech Services <noreply@zentech.com>',
      to: data.customerEmail,
      subject: `Order Confirmation: ${orderNumber}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for placing your order!</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Price:</strong> $${data.totalPrice}</p>
        <p>We will contact you soon with updates about your order.</p>
      `,
    })

    // Send admin notification
    await resend.emails.send({
      from: 'Zentech Services <noreply@zentech.com>',
      to: 'admin@zentech.com',
      subject: `New Order Received: ${orderNumber}`,
      html: `
        <h2>New Order</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer Name:</strong> ${data.customerName}</p>
        <p><strong>Customer Email:</strong> ${data.customerEmail}</p>
        <p><strong>Customer Phone:</strong> ${data.customerPhone || 'Not provided'}</p>
        <p><strong>Total Price:</strong> $${data.totalPrice}</p>
        <p><strong>Description:</strong> ${data.description || 'Not provided'}</p>
      `,
    })
  }

  revalidatePath('/admin/orders')
  return result[0]
}

export async function getOrders() {
  const userId = await getUserId()
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
}

export async function updateOrderStatus(orderId: number, status: string) {
  const userId = await getUserId()
  
  const result = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .returning()

  revalidatePath('/admin/orders')
  return result[0]
}

export async function deleteOrder(orderId: number) {
  const userId = await getUserId()
  
  await db
    .delete(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))

  revalidatePath('/admin/orders')
}
