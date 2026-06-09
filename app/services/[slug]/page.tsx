'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getServiceBySlug } from '@/app/actions/services'
import { createOrder } from '@/app/actions/orders'
import { useRouter } from 'next/navigation'

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  // Fetch service on mount
  useEffect(() => {
    const fetchService = async () => {
      try {
        const s = await getServiceBySlug(params.slug)
        setService(s)
      } catch (error) {
        console.error('Error fetching service:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [params.slug])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return

    setSubmitting(true)
    try {
      await createOrder({
        serviceId: service.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        description: formData.description || undefined,
        totalPrice: service.price.toString(),
      })
      
      // Clear form and show success message
      setFormData({ customerName: '', customerEmail: '', customerPhone: '', description: '' })
      alert('Order placed successfully! We will contact you soon.')
      router.push('/services')
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading service details...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-gray-600 mb-4">Service not found</p>
          <Link href="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <section className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/services" className="text-blue-600 hover:text-blue-700">
                Services
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{service.name}</span>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Service Info */}
              <div>
                {service.imageUrl && (
                  <div className="mb-6 rounded-lg bg-gray-200 h-64 w-full overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                  {service.category}
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {service.name}
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                    <ul className="mt-4 space-y-2">
                      {service.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <span className="mr-3 text-blue-600">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 space-y-2">
                  {service.deliveryTime && (
                    <p className="text-gray-600">
                      <strong>Delivery Time:</strong> {service.deliveryTime}
                    </p>
                  )}
                  {service.revisions && (
                    <p className="text-gray-600">
                      <strong>Revisions:</strong> {service.revisions}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Form */}
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${service.price}
                  </div>
                  <p className="text-gray-600">Complete your order below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
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
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
