'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/app/actions/admin'
import { updateService, deleteService, createService } from '@/app/actions/admin-management'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Service {
  id: number
  name: string
  slug: string
  description: string
  category: string
  price: number
  delivery_time: string
  revisions: number
}

export default function ServicesManagementPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'Development',
    price: 0,
    delivery_time: '2 weeks',
    revisions: 2,
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getAdminSession()
        if (!session) {
          router.push('/admin-login')
          return
        }

        // Fetch services
        const response = await fetch('/api/services')
        const data = await response.json()
        setServices(data)
      } catch (error) {
        console.error('Error:', error)
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      category: service.category,
      price: service.price,
      delivery_time: service.delivery_time,
      revisions: service.revisions,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await updateService(editingId, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          delivery_time: formData.delivery_time,
          revisions: formData.revisions,
        })
      } else {
        await createService(formData)
      }

      // Refresh services
      const response = await fetch('/api/services')
      const data = await response.json()
      setServices(data)

      setFormData({
        name: '',
        slug: '',
        description: '',
        category: 'Development',
        price: 0,
        delivery_time: '2 weeks',
        revisions: 2,
      })
      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id)
        setServices(services.filter(s => s.id !== id))
      } catch (error) {
        console.error('Error deleting service:', error)
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
              Services Management
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
        {/* Add Service Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-foreground text-background hover:bg-muted-foreground"
          >
            + Add New Service
          </Button>
        )}

        {/* Form */}
        {showForm && (
          <div className="border border-border p-8 bg-secondary rounded mb-12">
            <h2 className="text-2xl font-light text-foreground mb-6">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Service Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Slug
                  </label>
                  <Input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full border border-border px-3 py-2 rounded"
                    required
                  />
                </div>
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

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-border px-3 py-2 rounded"
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Price (₹)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full border border-border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Delivery Time
                  </label>
                  <Input
                    type="text"
                    value={formData.delivery_time}
                    onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                    className="w-full border border-border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-foreground mb-2">
                    Revisions
                  </label>
                  <Input
                    type="number"
                    value={formData.revisions}
                    onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) })}
                    className="w-full border border-border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-foreground text-background hover:bg-muted-foreground"
                >
                  {editingId ? 'Update Service' : 'Create Service'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({
                      name: '',
                      slug: '',
                      description: '',
                      category: 'Development',
                      price: 0,
                      delivery_time: '2 weeks',
                      revisions: 2,
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

        {/* Services List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-foreground mb-6">All Services</h2>
          {services.map((service) => (
            <div key={service.id} className="border border-border p-6 bg-secondary rounded flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-light text-foreground">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>₹{service.price}</span>
                  <span>{service.delivery_time}</span>
                  <span>{service.revisions} revisions</span>
                  <span className="bg-background px-2 py-1 rounded">{service.category}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleEdit(service)}
                  variant="outline"
                  className="border border-border"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(service.id)}
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
