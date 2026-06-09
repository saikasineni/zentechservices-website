import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Zentech</h3>
            <p className="mt-2 text-sm text-gray-600">Professional digital services for your business.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Services</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/services" className="text-sm text-gray-600 hover:text-gray-900">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=web" className="text-sm text-gray-600 hover:text-gray-900">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services?category=design" className="text-sm text-gray-600 hover:text-gray-900">
                  Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-gray-600 hover:text-gray-900">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Program</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/affiliate" className="text-sm text-gray-600 hover:text-gray-900">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            &copy; 2024 Zentech Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
