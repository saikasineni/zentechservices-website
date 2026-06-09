'use server'

import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { getAdminSession } from './admin'

async function ensureAdminAccess() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('Unauthorized: Admin access required')
  }
  return session
}

// Services Management
export async function updateService(
  serviceId: number,
  data: {
    name?: string
    description?: string
    price?: number
    delivery_time?: string
    revisions?: number
  }
) {
  await ensureAdminAccess()

  const updates = Object.entries(data)
    .filter(([, v]) => v !== undefined)
    .map(([key, value]) => {
      if (value === null) return `${key} = NULL`
      if (typeof value === 'number') return `${key} = ${value}`
      return `${key} = '${value}'`
    })
    .join(', ')

  if (!updates) return { success: false, message: 'No updates provided' }

  await db.execute(
    sql.raw(`UPDATE services SET ${updates}, updated_at = NOW() WHERE id = ${serviceId}`)
  )

  return { success: true, message: 'Service updated successfully' }
}

export async function createService(data: {
  name: string
  slug: string
  description: string
  category: string
  price: number
  delivery_time: string
  revisions: number
}) {
  await ensureAdminAccess()

  await db.execute(
    sql`INSERT INTO services (name, slug, description, category, price, delivery_time, revisions, "userId") 
        VALUES (${data.name}, ${data.slug}, ${data.description}, ${data.category}, ${data.price}, ${data.delivery_time}, ${data.revisions}, 'sample-user')`
  )

  return { success: true, message: 'Service created successfully' }
}

export async function deleteService(serviceId: number) {
  await ensureAdminAccess()

  await db.execute(sql`DELETE FROM services WHERE id = ${serviceId}`)

  return { success: true, message: 'Service deleted successfully' }
}

// Portfolio Management
export async function updatePortfolioItem(
  itemId: number,
  data: {
    title?: string
    description?: string
    link?: string
  }
) {
  await ensureAdminAccess()

  const updates = Object.entries(data)
    .filter(([, v]) => v !== undefined)
    .map(([key, value]) => {
      if (typeof value === 'string') return `${key} = '${value}'`
      return `${key} = ${value}`
    })
    .join(', ')

  if (!updates) return { success: false, message: 'No updates provided' }

  await db.execute(
    sql.raw(`UPDATE portfolio SET ${updates}, updated_at = NOW() WHERE id = ${itemId}`)
  )

  return { success: true, message: 'Portfolio item updated successfully' }
}

export async function createPortfolioItem(data: {
  title: string
  description: string
  category: string
  link: string
}) {
  await ensureAdminAccess()

  await db.execute(
    sql`INSERT INTO portfolio (title, description, category, link, "userId") 
        VALUES (${data.title}, ${data.description}, ${data.category}, ${data.link}, 'sample-user')`
  )

  return { success: true, message: 'Portfolio item created successfully' }
}

export async function deletePortfolioItem(itemId: number) {
  await ensureAdminAccess()

  await db.execute(sql`DELETE FROM portfolio WHERE id = ${itemId}`)

  return { success: true, message: 'Portfolio item deleted successfully' }
}

// Affiliate Management
export async function updateAffiliate(
  affiliateId: number,
  data: {
    status?: string
    commission_rate?: number
  }
) {
  await ensureAdminAccess()

  const updates = Object.entries(data)
    .filter(([, v]) => v !== undefined)
    .map(([key, value]) => {
      if (typeof value === 'number') return `${key} = ${value}`
      return `${key} = '${value}'`
    })
    .join(', ')

  if (!updates) return { success: false, message: 'No updates provided' }

  await db.execute(
    sql.raw(`UPDATE affiliates SET ${updates}, updated_at = NOW() WHERE id = ${affiliateId}`)
  )

  return { success: true, message: 'Affiliate updated successfully' }
}

export async function getAllAffiliates() {
  await ensureAdminAccess()

  const result = await db.execute(
    sql`SELECT * FROM affiliates ORDER BY created_at DESC`
  )

  return result.rows
}

// Dashboard Stats
export async function getDashboardStats() {
  await ensureAdminAccess()

  const [services, portfolio, contacts, orders, affiliates] = await Promise.all([
    db.execute(sql`SELECT COUNT(*) as count FROM services`),
    db.execute(sql`SELECT COUNT(*) as count FROM portfolio`),
    db.execute(sql`SELECT COUNT(*) as count FROM contacts WHERE status = 'new'`),
    db.execute(sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`),
    db.execute(sql`SELECT COUNT(*) as count FROM affiliates WHERE status = 'pending'`),
  ])

  return {
    totalServices: services.rows[0]?.count || 0,
    totalPortfolio: portfolio.rows[0]?.count || 0,
    newContacts: contacts.rows[0]?.count || 0,
    pendingOrders: orders.rows[0]?.count || 0,
    pendingAffiliates: affiliates.rows[0]?.count || 0,
  }
}
