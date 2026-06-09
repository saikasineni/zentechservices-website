'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/app/actions/admin'
import { updateAffiliate, getAllAffiliates } from '@/app/actions/admin-management'
import { Button } from '@/components/ui/button'

interface Affiliate {
  id: number
  name: string
  email: string
  phone: string
  website: string
  commission_rate: number
  status: string
  referral_code: string
  total_referrals: number
  total_commission: number
}

export default function AffiliateManagementPage() {
  const router = useRouter()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getAdminSession()
        if (!session) {
          router.push('/admin-login')
          return
        }

        const data = await getAllAffiliates()
        setAffiliates(data)
      } catch (error) {
        console.error('Error:', error)
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleApprove = async (id: number) => {
    setUpdatingId(id)
    try {
      await updateAffiliate(id, { status: 'approved' })
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: 'approved' } : a))
    } catch (error) {
      console.error('Error approving affiliate:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleReject = async (id: number) => {
    setUpdatingId(id)
    try {
      await updateAffiliate(id, { status: 'rejected' })
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
    } catch (error) {
      console.error('Error rejecting affiliate:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleChangeCommission = async (id: number, newRate: number) => {
    try {
      await updateAffiliate(id, { commission_rate: newRate })
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, commission_rate: newRate } : a))
    } catch (error) {
      console.error('Error updating commission:', error)
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
              Affiliate Management
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
        {/* Store Links Section */}
        <div className="mb-12 border border-border p-8 bg-secondary rounded">
          <h2 className="text-xl font-light text-foreground mb-6">
            Digital Store Management
          </h2>
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
                className="inline-block text-foreground border-b border-foreground text-sm hover:text-primary transition-colors"
              >
                Manage Store →
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
                className="inline-block text-foreground border-b border-foreground text-sm hover:text-primary transition-colors"
              >
                Manage Store →
              </a>
            </div>
          </div>
        </div>

        {/* Affiliates List */}
        <div>
          <h2 className="text-2xl font-light text-foreground mb-6">All Affiliates</h2>
          <div className="space-y-4">
            {affiliates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No affiliates yet</p>
            ) : (
              affiliates.map((affiliate) => (
                <div key={affiliate.id} className="border border-border p-6 bg-secondary rounded">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-light text-foreground">{affiliate.name}</h3>
                      <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-light uppercase ${
                      affiliate.status === 'approved' ? 'bg-green-100 text-green-700' :
                      affiliate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {affiliate.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="text-foreground font-light">{affiliate.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Referral Code</p>
                      <p className="text-foreground font-light">{affiliate.referral_code}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Commission Rate</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={affiliate.commission_rate}
                          onChange={(e) => handleChangeCommission(affiliate.id, parseFloat(e.target.value))}
                          className="w-20 border border-border px-2 py-1 rounded text-sm"
                          step="0.1"
                          min="0"
                          max="100"
                        />
                        <span className="text-foreground">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Referrals</p>
                      <p className="text-foreground font-light">{affiliate.total_referrals}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Commission</p>
                      <p className="text-foreground font-light">₹{affiliate.total_commission.toFixed(2)}</p>
                    </div>
                  </div>

                  {affiliate.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <Button
                        onClick={() => handleApprove(affiliate.id)}
                        disabled={updatingId === affiliate.id}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(affiliate.id)}
                        disabled={updatingId === affiliate.id}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
