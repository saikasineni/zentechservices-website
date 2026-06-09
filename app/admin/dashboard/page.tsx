'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession, logoutAdmin } from '@/app/actions/admin'
import { getDashboardStats } from '@/app/actions/admin-management'
import { Button } from '@/components/ui/button'

interface Stats {
  totalServices: number
  totalPortfolio: number
  newContacts: number
  pendingOrders: number
  pendingAffiliates: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getAdminSession()
        if (!session) {
          router.push('/admin-login')
          return
        }
        setAuthorized(true)

        const dashStats = await getDashboardStats()
        setStats(dashStats)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await logoutAdmin()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              zentechservices62@gmail.com
            </p>
          </div>
          <Button
            onClick={handleLogout}
            className="border border-border text-foreground hover:bg-background"
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-12">
          <div className="border border-border p-6 bg-secondary rounded">
            <p className="text-sm text-muted-foreground mb-2">Total Services</p>
            <p className="text-3xl font-light text-foreground">{stats?.totalServices}</p>
          </div>
          <div className="border border-border p-6 bg-secondary rounded">
            <p className="text-sm text-muted-foreground mb-2">Portfolio Items</p>
            <p className="text-3xl font-light text-foreground">{stats?.totalPortfolio}</p>
          </div>
          <div className="border border-border p-6 bg-secondary rounded">
            <p className="text-sm text-muted-foreground mb-2">New Contacts</p>
            <p className="text-3xl font-light text-foreground">{stats?.newContacts}</p>
          </div>
          <div className="border border-border p-6 bg-secondary rounded">
            <p className="text-sm text-muted-foreground mb-2">Pending Orders</p>
            <p className="text-3xl font-light text-foreground">{stats?.pendingOrders}</p>
          </div>
          <div className="border border-border p-6 bg-secondary rounded">
            <p className="text-sm text-muted-foreground mb-2">Pending Affiliates</p>
            <p className="text-3xl font-light text-foreground">{stats?.pendingAffiliates}</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Services Management */}
          <div className="border border-border p-8 bg-secondary rounded">
            <h2 className="text-2xl font-light text-foreground mb-4">
              Services Management
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Add, edit, or delete services. Manage pricing, delivery times, and revisions.
            </p>
            <Link href="/admin/services-management">
              <Button className="w-full bg-foreground text-background hover:bg-muted-foreground">
                Manage Services
              </Button>
            </Link>
          </div>

          {/* Portfolio Management */}
          <div className="border border-border p-8 bg-secondary rounded">
            <h2 className="text-2xl font-light text-foreground mb-4">
              Portfolio Management
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Update portfolio projects with images, descriptions, and project links.
            </p>
            <Link href="/admin/portfolio-management">
              <Button className="w-full bg-foreground text-background hover:bg-muted-foreground">
                Manage Portfolio
              </Button>
            </Link>
          </div>

          {/* Affiliate Management */}
          <div className="border border-border p-8 bg-secondary rounded">
            <h2 className="text-2xl font-light text-foreground mb-4">
              Affiliate Management
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Approve/reject affiliates, manage commission rates, and view store links.
            </p>
            <Link href="/admin/affiliate-management">
              <Button className="w-full bg-foreground text-background hover:bg-muted-foreground">
                Manage Affiliates
              </Button>
            </Link>
          </div>

          {/* Orders & Contacts */}
          <div className="border border-border p-8 bg-secondary rounded">
            <h2 className="text-2xl font-light text-foreground mb-4">
              Orders & Contacts
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              View and respond to customer orders, inquiries, and support requests.
            </p>
            <Link href="/admin/orders-contacts">
              <Button className="w-full bg-foreground text-background hover:bg-muted-foreground">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Store Links Section */}
        <div className="mt-12 border border-border p-8 bg-secondary rounded">
          <h2 className="text-2xl font-light text-foreground mb-4">
            Digital Store Links
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Manage affiliate marketing store links and categories.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-border p-6 bg-background rounded">
              <h3 className="text-lg font-light text-foreground mb-2">
                Student Digital Store
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                https://topmate.io/sai_royal/2
              </p>
              <a 
                href="https://topmate.io/sai_royal/2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground border-b border-foreground text-sm hover:text-primary transition-colors"
              >
                Open Store →
              </a>
            </div>

            <div className="border border-border p-6 bg-background rounded">
              <h3 className="text-lg font-light text-foreground mb-2">
                Business Resources Store
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                https://kasinenisai.gumroad.com/
              </p>
              <a 
                href="https://kasinenisai.gumroad.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground border-b border-foreground text-sm hover:text-primary transition-colors"
              >
                Open Store →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
