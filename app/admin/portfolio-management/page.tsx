'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/app/actions/admin'
import { updatePortfolioItem, deletePortfolioItem, createPortfolioItem } from '@/app/actions/admin-management'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PortfolioItem {
  id: number
  title: string
  description: string
  category: string
  link: string
}

export default function PortfolioManagementPage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Design',
    link: '',
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getAdminSession()
        if (!session) {
          router.push('/admin-login')
          return
        }

        // Fetch portfolio
        const response = await fetch('/api/portfolio')
        const data = await response.json()
        setPortfolio(data)
      } catch (error) {
        console.error('Error:', error)
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      link: item.link,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await updatePortfolioItem(editingId, {
          title: formData.title,
          description: formData.description,
          link: formData.link,
        })
      } else {
        await createPortfolioItem(formData)
      }

      // Refresh portfolio
      const response = await fetch('/api/portfolio')
      const data = await response.json()
      setPortfolio(data)

      setFormData({
        title: '',
        description: '',
        category: 'Design',
        link: '',
      })
      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error saving portfolio item:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await deletePortfolioItem(id)
        setPortfolio(portfolio.filter(p => p.id !== id))
      } catch (error) {
        console.error('Error deleting portfolio item:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light text-foreground">
              Portfolio Management
            </h1>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="border border-border">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        {/* Add Portfolio Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-foreground text-background hover:bg-muted-foreground"
          >
            + Add Portfolio Item
          </Button>
        )}

        {/* Form */}
        {showForm && (
          <div className="border border-border p-8 bg-secondary rounded mb-12">
            <h2 className="text-2xl font-light text-foreground mb-6">
              {editingId ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-light text-foreground mb-2">
                  Project Title
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-light text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-border px-3 py-2 rounded min-h-24"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-border px-3 py-2 rounded"
                  >
                    <option>Design</option>
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Project Link/URL
                  </label>
                  <Input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full border border-border px-3 py-2 rounded"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-foreground text-background hover:bg-muted-foreground"
                >
                  {editingId ? 'Update Item' : 'Create Item'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({
                      title: '',
                      description: '',
                      category: 'Design',
                      link: '',
                    })
                  }}
                  variant="outline"
                  className="border border-border"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Portfolio List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-foreground mb-6">All Portfolio Items</h2>
          {portfolio.map((item) => (
            <div key={item.id} className="border border-border p-6 bg-secondary rounded flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-light text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span className="bg-background px-2 py-1 rounded">{item.category}</span>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-foreground border-b border-foreground hover:text-primary">
                    View Project →
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleEdit(item)}
                  variant="outline"
                  className="border border-border"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
