import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getPublicServices } from '@/app/actions/services'

export const revalidate = 3600

export default async function ServicesPage() {
  const services = await getPublicServices()
  
  // Group services by category
  const groupedServices = services.reduce((acc: Record<string, typeof services>, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {})

  const categories = Object.keys(groupedServices).sort()

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

        {/* Services by Category */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {services.length === 0 ? (
              <div className="border-2 border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No services available yet.</p>
              </div>
            ) : (
              <div className="space-y-20">
                {categories.map((category) => (
                  <div key={category}>
                    <h2 className="text-3xl font-light text-foreground mb-8 pb-4 border-b border-border">
                      {category}
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {groupedServices[category].map((service) => (
                        <Link key={service.id} href={`/services/${service.slug}`}>
                          <div className="h-full border border-border p-8 hover:border-foreground hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group">
                            <div className="mb-4 inline-block px-3 py-1 bg-secondary text-xs font-medium text-foreground uppercase tracking-widest">
                              {service.category}
                            </div>
                            <h3 className="text-2xl font-light text-foreground mb-3 group-hover:text-primary transition-colors">
                              {service.name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex-grow mb-6 leading-relaxed line-clamp-3">
                              {service.description}
                            </p>
                            
                            {/* Service Features */}
                            <div className="mb-6 space-y-2 text-sm text-muted-foreground">
                              {service.delivery_time && (
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground font-light">⏱</span>
                                  <span>{service.delivery_time} delivery</span>
                                </div>
                              )}
                              {service.revisions && (
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground font-light">↻</span>
                                  <span>{service.revisions} revisions</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="pt-6 border-t border-border flex items-center justify-between">
                              <span className="text-3xl font-light text-foreground">
                                ₹{Math.round(service.price).toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">View →</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Feature Highlight Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-secondary border-t border-border">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-light text-foreground mb-12 text-center">
              Why Choose Zentech?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border border-border p-6 bg-background">
                <div className="text-3xl font-light text-foreground mb-3">✓</div>
                <h3 className="text-xl font-light text-foreground mb-2">Affordable Pricing</h3>
                <p className="text-muted-foreground text-sm">Competitive prices without compromising quality. We believe great design shouldn't break your budget.</p>
              </div>
              <div className="border border-border p-6 bg-background">
                <div className="text-3xl font-light text-foreground mb-3">✓</div>
                <h3 className="text-xl font-light text-foreground mb-2">Quick Turnaround</h3>
                <p className="text-muted-foreground text-sm">Fast delivery times on all services. Get your projects completed on schedule without delays.</p>
              </div>
              <div className="border border-border p-6 bg-background">
                <div className="text-3xl font-light text-foreground mb-3">✓</div>
                <h3 className="text-xl font-light text-foreground mb-2">Multiple Revisions</h3>
                <p className="text-muted-foreground text-sm">Unlimited revisions until you're satisfied. Your feedback shapes the final product perfectly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-foreground text-background border-t border-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-light">
              Ready to Get Started?
            </h2>
            <p className="mt-6 text-lg text-gray-300">
              Choose a service above or contact us for custom quotes and tailored solutions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button className="px-8 py-6 bg-background text-foreground hover:bg-secondary">
                  Contact Us
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="px-8 py-6 border-background text-background hover:bg-opacity-10 hover:bg-background">
                  Back to Home
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
