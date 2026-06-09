'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createAffiliateApplication } from '@/app/actions/affiliates'

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    bankDetails: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createAffiliateApplication(formData)
      setFormData({ name: '', email: '', phone: '', website: '', bankDetails: '' })
      alert('Thank you for applying! We will review your application and get back to you soon.')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold">
              Join Our Affiliate Program
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Earn commissions by promoting our services to your network.
            </p>
          </div>
        </section>

        {/* Program Details */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Why Join Us?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">10%</div>
                <h3 className="font-semibold text-gray-900">Commission Rate</h3>
                <p className="mt-2 text-gray-600">Earn 10% commission on every sale you refer</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                <h3 className="font-semibold text-gray-900">Unlimited Earning</h3>
                <p className="mt-2 text-gray-600">No caps on your earnings. More referrals = more commission</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <h3 className="font-semibold text-gray-900">Dedicated Support</h3>
                <p className="mt-2 text-gray-600">Get support and marketing materials anytime</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Apply Today
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website or Blog
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bank Details (for payments)
                </label>
                <textarea
                  name="bankDetails"
                  value={formData.bankDetails}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Account holder name, bank name, account number, routing number..."
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p><strong>Next Steps:</strong> After applying, our team will review your application and send you a confirmation with your unique referral code and marketing materials.</p>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Submitting...' : 'Apply to Affiliate Program'}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
