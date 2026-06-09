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
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-light text-foreground">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Comprehensive digital solutions designed to elevate your business. From web development to marketing, we deliver quality services at competitive prices.
            </p>
            <div className="mt-3 h-1 w-16 bg-foreground"></div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {services.length === 0 ? (
              <div className="border-2 border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No services available yet.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Link key={service.id} href={`/services/${service.slug}`}>
                    <div className="h-full border border-border p-8 hover:border-foreground transition-colors duration-300 cursor-pointer flex flex-col">
                      <div className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        {service.category}
                      </div>
                      <h3 className="text-2xl font-medium text-foreground mb-3">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground flex-grow mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="pt-6 border-t border-border flex items-center justify-between">
                        <span className="text-3xl font-light text-foreground">
                          ₹{service.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">View →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-secondary border-t border-border">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-light text-foreground">
              Need Custom Services?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Contact us for custom quotes and tailored solutions for your specific needs.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button className="bg-foreground text-background hover:bg-muted-foreground">
                  Get in Touch
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
