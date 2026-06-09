'use client'

import { Button } from '@/components/ui/button'

export default function AdminPortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="mt-2 text-gray-600">Manage your portfolio items and case studies</p>
        </div>
        <Button>Add Portfolio Item</Button>
      </div>

      <div className="rounded-lg bg-white shadow p-12 text-center">
        <p className="text-gray-600">Portfolio management coming soon</p>
        <p className="text-sm text-gray-500 mt-2">You can manage your portfolio items here</p>
      </div>
    </div>
  )
}
