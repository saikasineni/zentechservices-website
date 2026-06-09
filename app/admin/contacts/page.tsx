'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getContacts, updateContactStatus, deleteContact } from '@/app/actions/contacts'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const data = await getContacts()
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (contactId: number, newStatus: string) => {
    try {
      await updateContactStatus(contactId, newStatus)
      await loadContacts()
    } catch (error) {
      console.error('Error updating contact:', error)
      alert('Failed to update contact')
    }
  }

  const handleDelete = async (contactId: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await deleteContact(contactId)
      await loadContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Failed to delete contact')
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading contacts...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="mt-2 text-gray-600">Manage form submissions and inquiries</p>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="rounded-lg bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Subject:</strong> {contact.subject}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold border-0 cursor-pointer mb-2 ${
                      contact.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : contact.status === 'new'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <button
                onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {expandedId === contact.id ? 'Hide Message' : 'Show Message'}
              </button>

              {expandedId === contact.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-700 border border-gray-200">
                  {contact.message}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (contact.email) {
                      window.location.href = `mailto:${contact.email}`
                    }
                  }}
                >
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(contact.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No contacts found
        </div>
      )}
    </div>
  )
}
