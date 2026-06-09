'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

interface PortfolioItem {
  id: number
  title: string
  description: string
  category: string
  link: string
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch('/api/portfolio')
        if (response.ok) {
          const data = await response.json()
          setPortfolio(data)
        }
      } catch (error) {
        console.error('Failed to fetch portfolio:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const groupedProjects = portfolio.reduce((acc: Record<string, PortfolioItem[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const categories = Object.keys(groupedProjects).sort()
  const displayCategories = activeCategory ? [activeCategory] : categories

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="border-b border-border py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="font-light text-4xl md:text-5xl mb-6 text-balance">
              Our Work
            </h1>
            <p className="font-light text-lg text-muted-foreground mb-8">
              Explore the projects we&apos;ve completed for clients across web development, design, and marketing. Each project represents our commitment to quality and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 border transition-colors ${
                activeCategory === null
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-foreground hover:border-foreground'
              }`}
            >
              All Projects
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 border transition-colors ${
                  activeCategory === cat
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center text-muted-foreground py-16">Loading projects...</div>
          ) : portfolio.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">No projects found</div>
          ) : (
            <div className="space-y-16">
              {displayCategories.map((category) => (
                <div key={category}>
                  <h2 className="font-light text-2xl md:text-3xl mb-8 pb-4 border-b border-border">
                    {category}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedProjects[category]?.map((project) => (
                      <div
                        key={project.id}
                        className="border border-border p-6 hover:border-foreground transition-all hover:shadow-md group"
                      >
                        <div className="h-40 bg-secondary mb-6 flex items-center justify-center rounded">
                          <div className="text-center">
                            <div className="text-4xl font-light mb-2 text-muted-foreground">
                              {project.category.substring(0, 2).toUpperCase()}
                            </div>
                            <p className="text-sm text-muted-foreground font-light">Project</p>
                          </div>
                        </div>
                        
                        <h3 className="font-light text-lg mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground font-light mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Star Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-4 h-4 fill-foreground"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-light text-muted-foreground">5.0</span>
                        </div>

                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-foreground border-b border-foreground hover:text-primary transition-colors font-light"
                        >
                          View Project →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-light text-3xl md:text-4xl mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-muted-foreground mb-8 font-light">
            Let&apos;s discuss how we can help bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-foreground text-background hover:bg-primary transition-colors font-light"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
