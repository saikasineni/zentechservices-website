import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getOrders } from '@/app/actions/orders'
import { getContacts } from '@/app/actions/contacts'
import { getServices } from '@/app/actions/services'

export default async function AdminDashboard() {
  const [orders, contacts, services] = await Promise.all([
    getOrders(),
    getContacts(),
    getServices(),
  ])

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      href: '/admin/orders',
    },
    {
      label: 'New Contacts',
      value: contacts.filter((c: any) => c.status === 'new').length,
      href: '/admin/contacts',
    },
    {
      label: 'Services',
      value: services.length,
      href: '/admin/services',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition cursor-pointer">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Order</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.totalPrice}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-600">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
            <Link href="/admin/contacts">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.slice(0, 5).map((contact: any) => (
                <tr key={contact.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{contact.subject}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      contact.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : contact.status === 'new'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-600">
              No contacts yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
