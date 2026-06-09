'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Get session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await authClient.getSession()
        setUser(session.data?.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    getSession()
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600">
            <span>Zentech</span>
          </Link>

          <div className="hidden md:flex md:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-gray-900">
              Services
            </Link>
            <Link href="/portfolio" className="text-gray-600 hover:text-gray-900">
              Portfolio
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/affiliate" className="text-gray-600 hover:text-gray-900">
              Affiliate
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className="text-sm text-gray-600">{user.name || user.email}</span>
                    <Button
                      onClick={() => router.push('/admin')}
                      variant="outline"
                      size="sm"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      size="sm"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
