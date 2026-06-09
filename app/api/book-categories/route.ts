import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const result = await db.execute(
      sql`SELECT id, name, description, store_link, store_type, icon FROM book_categories ORDER BY created_at DESC`
    )
    return Response.json(result.rows)
  } catch (error) {
    console.error('Error fetching book categories:', error)
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
