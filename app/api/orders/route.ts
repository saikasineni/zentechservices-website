import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const result = await db.execute(
      sql`SELECT id, order_number, customer_name, customer_email, status, total_price FROM orders ORDER BY created_at DESC`
    )
    return Response.json(result.rows)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return Response.json([], { status: 500 })
  }
}
