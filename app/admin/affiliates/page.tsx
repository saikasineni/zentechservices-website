'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getAffiliates, updateAffiliateStatus } from '@/app/actions/affiliates'

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAffiliates()
  }, [])

  const loadAffiliates = async () => {
    try {
      const data = await getAffiliates()
      setAffiliates(data)
    } catch (error) {
      console.error('Error loading affiliates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (affiliateId: number, newStatus: string) => {
    try {
      await updateAffiliateStatus(affiliateId, newStatus)
      await loadAffiliates()
    } catch (error) {
      console.error('Error updating affiliate:', error)
      alert('Failed to update affiliate')
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading affiliates...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Affiliates</h1>
        <p className="mt-2 text-gray-600">Manage affiliate program members and approvals</p>
      </div>

      <div className="rounded-lg bg-white shadow overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Referral Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Commission Rate</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total Commission</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{affiliate.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{affiliate.email}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{affiliate.referralCode}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{affiliate.commissionRate}%</td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={affiliate.status}
                    onChange={(e) => handleStatusChange(affiliate.id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold border-0 cursor-pointer ${
                      affiliate.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : affiliate.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${Number(affiliate.totalCommission || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {affiliates.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-600">
            No affiliates found
          </div>
        )}
      </div>
    </div>
  )
}
