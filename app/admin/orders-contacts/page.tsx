'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  status: string
  total_price: number
}

interface Contact {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: string
}

export default function OrdersContactsPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'contacts'>('orders')

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getAdminSession()
        if (!session) {
          router.push('/admin-login')
          return
        }

        // Fetch orders and contacts
        const [ordersRes, contactsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/contacts'),
        ])

        const ordersData = await ordersRes.json()
        const contactsData = await contactsRes.json()

        setOrders(ordersData)
        setContacts(contactsData)
      } catch (error) {
        console.error('Error:', error)
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

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
              Orders & Contacts
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
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 font-light transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-3 font-light transition-colors ${
              activeTab === 'contacts'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Contacts ({contacts.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light text-foreground mb-6">Service Orders</h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-border p-6 bg-secondary rounded">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-light text-foreground">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-light uppercase ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Total: <span className="text-foreground font-light">₹{order.total_price}</span>
                    </p>
                    <Button
                      variant="outline"
                      className="border border-border text-sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light text-foreground mb-6">Contact Messages</h2>
            {contacts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No contacts yet</p>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="border border-border p-6 bg-secondary rounded">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-light text-foreground">
                        {contact.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-light uppercase ${
                      contact.status === 'replied' ? 'bg-green-100 text-green-700' :
                      contact.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {contact.message}
                  </p>
                  <Button
                    variant="outline"
                    className="border border-border text-sm"
                  >
                    View & Reply
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
