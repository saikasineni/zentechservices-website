import { db } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const revalidate = 3600

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    
    let query = db.select().from(reviews).where(eq(reviews.verified, true))
    
    if (serviceId) {
      query = db.select().from(reviews).where(
        eq(reviews.verified, true)
      )
    }
    
    const result = await query
    return Response.json(result)
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
