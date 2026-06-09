'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession()
        if (!session.data?.user) {
          router.push('/sign-in')
        } else {
          setUser(session.data.user)
        }
      } catch (error) {
        router.push('/sign-in')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Zentech Admin</h1>
        </div>

        <nav className="space-y-2 px-4">
          <Link
            href="/admin"
            className="block rounded-lg px-4 py-2 hover:bg-gray-800"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/services"
            className="block rounded-lg px-4 py-2 hover:bg-gray-800"
          >
            Services
          </Link>
          <Link
            href="/admin/orders"
            className="block rounded-lg px-4 py-2 hover:bg-gray-800"
          >
            Orders
          </Link>
          <Link
            href="/admin/contacts"
            className="block rounded-lg px-4 py-2 hover:bg-gray-800"
          >
            Contacts
          </Link>
          <Link
            href="/admin/affiliates"
            className="block rounded-lg px-4 py-2 hover:bg-gray-800"
          >
            Affiliates
          </Link>
          <Link
            href="/admin/portfolio"
            className="block rounded-lg px-4 py-2 hover:bg-gray-800"
          >
            Portfolio
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 w-64 border-t border-gray-800 p-4">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold">{user.name || user.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="bg-white shadow">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                View Site
              </Link>
            </div>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
