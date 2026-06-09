import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const result = await db.execute(
      sql`SELECT * FROM services ORDER BY category, name`
    )
    return Response.json(result.rows)
  } catch (error) {
    console.error('Error fetching services:', error)
    return Response.json([], { status: 500 })
  }
}
