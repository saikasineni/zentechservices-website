'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getOrders, updateOrderStatus, deleteOrder } from '@/app/actions/orders'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      await loadOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order')
    }
  }

  const handleDelete = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      await deleteOrder(orderId)
      await loadOrders()
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order')
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading orders...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-2 text-gray-600">Manage customer orders</p>
      </div>

      <div className="rounded-lg bg-white shadow overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.customerEmail}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.totalPrice}</td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold border-0 cursor-pointer ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-600">
            No orders found
          </div>
        )}
      </div>
    </div>
  )
}
