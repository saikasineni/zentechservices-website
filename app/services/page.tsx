import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getPublicServices } from '@/app/actions/services'

export default async function ServicesPage() {
  const services = await getPublicServices()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="border-b border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900">
              Our Services
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Explore our comprehensive range of digital services designed to elevate your business.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {services.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-600">No services available yet.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Link key={service.id} href={`/services/${service.slug}`}>
                    <div className="group h-full rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
                      {service.imageUrl && (
                        <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                          <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          {service.category}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {service.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">
                            ${service.price}
                          </span>
                          <Button variant="outline" size="sm">
                            View Details →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
