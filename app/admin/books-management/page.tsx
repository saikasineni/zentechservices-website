'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createBookCategory, updateBookCategory, deleteBookCategory, getAllBookCategories } from '@/app/actions/books'

interface BookCategory {
  id: number
  name: string
  description: string
  store_link: string
  store_type: string
  icon: string
}

export default function BooksManagementPage() {
  const [books, setBooks] = useState<BookCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    store_link: '',
    store_type: 'topmate',
    icon: '📚'
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await getAllBookCategories()
      setBooks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateBookCategory(editingId, formData)
      } else {
        await createBookCategory(formData)
      }
      resetForm()
      fetchBooks()
    } catch (error) {
      console.error('Error saving book category:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteBookCategory(id)
        fetchBooks()
      } catch (error) {
        console.error('Error deleting book category:', error)
      }
    }
  }

  const handleEdit = (book: BookCategory) => {
    setEditingId(book.id)
    setFormData({
      name: book.name,
      description: book.description,
      store_link: book.store_link,
      store_type: book.store_type,
      icon: book.icon
    })
    setIsAddingNew(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      store_link: '',
      store_type: 'topmate',
      icon: '📚'
    })
    setEditingId(null)
    setIsAddingNew(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-foreground">Book Categories Management</h1>
            <p className="text-muted-foreground mt-1">Manage affiliate marketing book categories and store links</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="border-border">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Add/Edit Form */}
          <div className="border border-border p-6 mb-8 bg-secondary">
            <h2 className="text-xl font-light text-foreground mb-6">
              {editingId ? 'Edit Book Category' : 'Add New Book Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Student Resources"
                    required
                    className="w-full px-3 py-2 border border-border rounded text-foreground bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">Icon</label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="e.g., 📚"
                    className="w-full px-3 py-2 border border-border rounded text-foreground bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-foreground mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this category..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded text-foreground bg-background"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">Store Type</label>
                  <select
                    name="store_type"
                    value={formData.store_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded text-foreground bg-background"
                  >
                    <option value="topmate">Topmate</option>
                    <option value="gumroad">Gumroad</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">Store Link</label>
                  <input
                    type="url"
                    name="store_link"
                    value={formData.store_link}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    required
                    className="w-full px-3 py-2 border border-border rounded text-foreground bg-background"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-foreground text-background hover:bg-muted-foreground">
                  {editingId ? 'Update Category' : 'Add Category'}
                </Button>
                {editingId && (
                  <Button type="button" onClick={resetForm} variant="outline" className="border-border">
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div>
            <h2 className="text-xl font-light text-foreground mb-6">Book Categories ({books.length})</h2>
            
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading categories...</div>
            ) : books.length === 0 ? (
              <div className="border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No book categories found. Add one above to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                  <div key={book.id} className="border border-border p-4 hover:border-foreground transition-colors">
                    <div className="text-3xl mb-2">{book.icon}</div>
                    <h3 className="font-light text-foreground mb-1">{book.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                    <div className="text-xs text-muted-foreground mb-3">
                      <p className="font-light">{book.store_type}</p>
                      <a href={book.store_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Store →
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(book)}
                        size="sm"
                        className="flex-1 text-xs"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(book.id)}
                        size="sm"
                        className="flex-1 text-xs bg-destructive text-background hover:bg-destructive/80"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
