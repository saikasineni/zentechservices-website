'use server'

import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function getAllBookCategories() {
  try {
    const result = await db.execute(
      sql`SELECT id, name, description, store_link, store_type, icon FROM book_categories ORDER BY name ASC`
    )
    return result.rows || []
  } catch (error) {
    console.error('Error fetching book categories:', error)
    return []
  }
}

export async function createBookCategory(data: {
  name: string
  description: string
  store_link: string
  store_type: string
  icon: string
}) {
  try {
    const result = await db.execute(
      sql`INSERT INTO book_categories (name, description, store_link, store_type, icon, "userId") 
          VALUES (${data.name}, ${data.description}, ${data.store_link}, ${data.store_type}, ${data.icon}, 'admin')
          RETURNING id, name, store_link`
    )
    return { success: true, data: result.rows?.[0] }
  } catch (error) {
    console.error('Error creating book category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function updateBookCategory(id: number, data: {
  name: string
  description: string
  store_link: string
  store_type: string
  icon: string
}) {
  try {
    const result = await db.execute(
      sql`UPDATE book_categories 
          SET name = ${data.name}, description = ${data.description}, store_link = ${data.store_link}, 
              store_type = ${data.store_type}, icon = ${data.icon}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING id, name`
    )
    return { success: true, data: result.rows?.[0] }
  } catch (error) {
    console.error('Error updating book category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteBookCategory(id: number) {
  try {
    await db.execute(
      sql`DELETE FROM book_categories WHERE id = ${id}`
    )
    return { success: true }
  } catch (error) {
    console.error('Error deleting book category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}
