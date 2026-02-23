'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { mockEvents } from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([...mockEvents])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<EventInsert>>({
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'upcoming',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    if (editingId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? { ...ev, ...formData, updated_at: now } as Event
            : ev
        )
      )
    } else {
      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        title: formData.title!,
        description: formData.description ?? null,
        date: formData.date!,
        location: formData.location ?? null,
        images: [],
        status: formData.status ?? 'upcoming',
        created_at: now,
        updated_at: now,
      }
      setEvents((prev) => [newEvent, ...prev])
    }
    resetForm()
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      location: event.location,
      status: event.status,
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      status: 'upcoming',
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'upcoming' | 'past' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update Event' : 'Add Event'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No events found. Add your first event!</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-gray-600 mb-3">{event.description}</p>
                  )}
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {event.location && (
                      <p>
                        <span className="font-medium">Location:</span> {event.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
