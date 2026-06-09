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
        {/* Hero Section - Classic Minimal */}
        <section className="border-b border-border px-4 py-24 sm:px-6 lg:px-8 bg-background">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-foreground">
                Zentech Services
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Professional digital solutions crafted for your business. Web development, design, marketing, and app development services tailored to your needs.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/services">
                  <Button className="px-8 py-6 text-base bg-foreground text-background hover:bg-muted-foreground">
                    Explore Services
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="px-8 py-6 text-base border border-foreground text-foreground hover:bg-secondary" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-background border-b border-border">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-foreground">
                Featured Services
              </h2>
              <div className="mt-2 h-1 w-16 bg-foreground mx-auto"></div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 3).map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <div className="border border-border p-8 hover:border-foreground transition-colors duration-300 cursor-pointer h-full flex flex-col">
                    <h3 className="text-xl font-medium text-foreground mb-3">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-grow mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-2xl font-light text-foreground">
                        ₹{service.price}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/services">
                <Button className="px-6 py-5 border border-foreground text-foreground hover:bg-secondary" variant="outline">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Affiliate Marketing Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-secondary border-b border-border">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-foreground">
                Affiliate Marketing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our affiliate program and earn commissions. Access our digital stores for exclusive resources and training materials.
              </p>
              <div className="mt-2 h-1 w-16 bg-foreground mx-auto"></div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Student Store */}
              <div className="border border-border p-8 bg-background hover:shadow-sm transition">
                <h3 className="text-2xl font-medium text-foreground mb-4">
                  Student Digital Store
                </h3>
                <p className="text-muted-foreground mb-6">
                  Access affordable learning resources, course materials, and study guides designed for students. Perfect for skill development and academic excellence.
                </p>
                <a 
                  href="https://topmate.io/sai_royal/2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-foreground text-background hover:bg-muted-foreground">
                    Visit Student Store →
                  </Button>
                </a>
              </div>

              {/* Business Store */}
              <div className="border border-border p-8 bg-background hover:shadow-sm transition">
                <h3 className="text-2xl font-medium text-foreground mb-4">
                  Business Resources Store
                </h3>
                <p className="text-muted-foreground mb-6">
                  Professional business tools, templates, and resources for entrepreneurs. Scale your business with our curated collection of digital assets and guides.
                </p>
                <a 
                  href="https://kasinenisai.gumroad.com/?_gl=1*1wur0qi*_ga*MTEyMTUwNzIwNy4xNzgxMDI1OTU2*_ga_6LJN6D94N6*czE3ODEwMjU5NTYkbzEkZzEkdDE3ODEwMjU5NzkkajM3JGwwJGgw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-foreground text-background hover:bg-muted-foreground">
                    Visit Business Store →
                  </Button>
                </a>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/affiliate">
                <Button className="px-8 py-6 text-base bg-foreground text-background hover:bg-muted-foreground">
                  Join Affiliate Program
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Classic */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-foreground text-background border-b border-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-light">
              Ready to Start Your Project?
            </h2>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              Let&apos;s discuss your vision and create something extraordinary together. Get in touch with our team today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button className="px-8 py-6 text-base bg-background text-foreground hover:bg-secondary">
                  Contact Us
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="px-8 py-6 text-base border-background text-background hover:bg-opacity-10 hover:bg-background">
                  View Services
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
