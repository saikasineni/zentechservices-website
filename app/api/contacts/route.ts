import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const result = await db.execute(
      sql`SELECT id, name, email, subject, message, status FROM contacts ORDER BY created_at DESC`
    )
    return Response.json(result.rows)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return Response.json([], { status: 500 })
  }
}
