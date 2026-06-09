'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createService(data: {
  name: string
  slug: string
  description: string
  category: string
  price: string
  imageUrl?: string
  features?: string[]
  deliveryTime?: string
  revisions?: number
}) {
  const userId = await getUserId()
  
  const result = await db
    .insert(services)
    .values({
      ...data,
      userId,
      price: parseFloat(data.price),
      revisions: data.revisions || 2,
    })
    .returning()

  revalidatePath('/admin/services')
  revalidatePath('/services')
  return result[0]
}

export async function getServices() {
  const userId = await getUserId()
  return db
    .select()
    .from(services)
    .where(eq(services.userId, userId))
    .orderBy(desc(services.createdAt))
}

export async function getPublicServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.active, true))
    .orderBy(desc(services.createdAt))
}

export async function getServiceBySlug(slug: string) {
  return db
    .select()
    .from(services)
    .where(eq(services.slug, slug))
    .limit(1)
    .then(result => result[0])
}

export async function updateService(serviceId: number, data: Partial<typeof services.$inferInsert>) {
  const userId = await getUserId()
  
  const result = await db
    .update(services)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(services.id, serviceId), eq(services.userId, userId)))
    .returning()

  revalidatePath('/admin/services')
  revalidatePath('/services')
  return result[0]
}

export async function deleteService(serviceId: number) {
  const userId = await getUserId()
  
  await db
    .delete(services)
    .where(and(eq(services.id, serviceId), eq(services.userId, userId)))

  revalidatePath('/admin/services')
  revalidatePath('/services')
}
