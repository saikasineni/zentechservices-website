import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getPublicServices } from '@/app/actions/services'

export default async function Home() {
  const services = await getPublicServices()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="border-b border-gray-200 bg-gradient-to-b from-blue-50 to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Digital Services for Your Business
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Professional digital solutions to help your business grow. From web development to custom design, we&apos;ve got you covered.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/services">
                  <Button size="lg">
                    Explore Services
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Services
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {services.slice(0, 3).map((service) => (
                <div key={service.id} className="rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                  {service.imageUrl && (
                    <div className="mb-4 h-40 w-full bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ${service.price}
                    </span>
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/services">
                <Button size="lg" variant="outline">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-gray-200 bg-blue-600 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Let&apos;s discuss your project and find the perfect solution for your needs.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Contact Us
                </Button>
              </Link>
              <Link href="/affiliate">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                  Join Affiliate Program
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
