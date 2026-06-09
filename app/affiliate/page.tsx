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

        {/* Digital Stores Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-background border-b border-border">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-foreground">
                Our Digital Stores
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Access our curated collection of books, courses, and resources across multiple categories
              </p>
              <div className="mt-2 h-1 w-16 bg-foreground mx-auto"></div>
            </div>

            {/* Store Categories Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {/* Student Resources Store */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-xl font-light text-foreground mb-2">Student Resources</h3>
                <p className="text-sm text-muted-foreground mb-4">Learning materials and study guides for students</p>
                <a href="https://topmate.io/sai_royal/2" target="_blank" rel="noopener noreferrer" className="inline-block text-foreground border-b border-foreground hover:text-primary transition-colors text-sm font-light">
                  Visit Store →
                </a>
              </div>

              {/* Business Guides Store */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-xl font-light text-foreground mb-2">Business Guides</h3>
                <p className="text-sm text-muted-foreground mb-4">Professional business resources and templates</p>
                <a href="https://kasinenisai.gumroad.com/" target="_blank" rel="noopener noreferrer" className="inline-block text-foreground border-b border-foreground hover:text-primary transition-colors text-sm font-light">
                  Visit Store →
                </a>
              </div>

              {/* Digital Products Store */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-xl font-light text-foreground mb-2">Digital Products</h3>
                <p className="text-sm text-muted-foreground mb-4">Software tools and digital assets for creators</p>
                <a href="https://topmate.io/sai_royal/2" target="_blank" rel="noopener noreferrer" className="inline-block text-foreground border-b border-foreground hover:text-primary transition-colors text-sm font-light">
                  Visit Store →
                </a>
              </div>

              {/* Web Development Resources */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-xl font-light text-foreground mb-2">Web Development</h3>
                <p className="text-sm text-muted-foreground mb-4">Web design and development resources</p>
                <a href="https://kasinenisai.gumroad.com/" target="_blank" rel="noopener noreferrer" className="inline-block text-foreground border-b border-foreground hover:text-primary transition-colors text-sm font-light">
                  Visit Store →
                </a>
              </div>

              {/* Marketing & Growth Store */}
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-light text-foreground mb-2">Marketing & Growth</h3>
                <p className="text-sm text-muted-foreground mb-4">Marketing strategies and growth hacking guides</p>
                <a href="https://topmate.io/sai_royal/2" target="_blank" rel="noopener noreferrer" className="inline-block text-foreground border-b border-foreground hover:text-primary transition-colors text-sm font-light">
                  Visit Store →
                </a>
              </div>

              {/* Main Store Link */}
              <div className="border border-border p-6 bg-secondary hover:border-foreground transition-colors">
                <div className="text-4xl mb-3">🏪</div>
                <h3 className="text-xl font-light text-foreground mb-2">All Categories</h3>
                <p className="text-sm text-muted-foreground mb-4">Browse complete catalog of all available resources</p>
                <a href="https://topmate.io/sai_royal/2" target="_blank" rel="noopener noreferrer" className="inline-block text-foreground border-b border-foreground hover:text-primary transition-colors text-sm font-light">
                  Explore All →
                </a>
              </div>
            </div>

            {/* Store Links Info */}
            <div className="border border-border bg-secondary p-8 text-center">
              <h3 className="text-2xl font-light text-foreground mb-4">Primary Store Links</h3>
              <div className="flex flex-col md:flex-row justify-center gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Student & Learning Resources</p>
                  <a href="https://topmate.io/sai_royal/2" target="_blank" rel="noopener noreferrer" className="text-foreground font-light hover:text-primary transition-colors break-all text-sm">
                    topmate.io/sai_royal/2
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Business & Professional Resources</p>
                  <a href="https://kasinenisai.gumroad.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-light hover:text-primary transition-colors break-all text-sm">
                    kasinenisai.gumroad.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Details */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-secondary">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-light text-foreground mb-12 text-center">
              Why Join Us?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="border border-border p-6 bg-background">
                <div className="text-3xl font-light text-foreground mb-2">₹499</div>
                <h3 className="font-light text-foreground">Affordable Commission</h3>
                <p className="mt-2 text-sm text-muted-foreground">Earn commissions by promoting our digital resources</p>
              </div>
              <div className="border border-border p-6 bg-background">
                <div className="text-3xl font-light text-foreground mb-2">∞</div>
                <h3 className="font-light text-foreground">Unlimited Earning</h3>
                <p className="mt-2 text-sm text-muted-foreground">No caps on earnings. More promotions = more commission</p>
              </div>
              <div className="border border-border p-6 bg-background">
                <div className="text-3xl font-light text-foreground mb-2">24/7</div>
                <h3 className="font-light text-foreground">Dedicated Support</h3>
                <p className="mt-2 text-sm text-muted-foreground">Support and marketing materials available anytime</p>
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
