import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900">
              Our Portfolio
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Check out some of our recent projects and case studies.
            </p>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-600 mb-4">Portfolio items coming soon.</p>
              <p className="text-sm text-gray-500">Check back soon to see our latest work.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
