import { db } from '@/lib/db'
import { portfolio } from '@/lib/db/schema'

export const revalidate = 3600 // Revalidate every hour for better performance

export async function GET() {
  try {
    const portfolioItems = await db.select().from(portfolio)
    return Response.json(portfolioItems)
  } catch (error) {
    console.error('Failed to fetch portfolio:', error)
    return Response.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
