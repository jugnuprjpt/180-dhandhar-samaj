'use client'

import { useMemo, useState } from 'react'
import { Calendar, MapPin, Clock, Image as ImageIcon } from 'lucide-react'
import { mockEvents } from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type Event = Database['public']['Tables']['events']['Row']

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [yearFilter, setYearFilter] = useState<string>('all')

  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(mockEvents.map((event) => new Date(event.date).getFullYear()))
    ).sort((a, b) => b - a)
    return years
  }, [])

  const filteredEvents = useMemo(() => {
    let filtered = [...mockEvents]
    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter)
    }
    if (yearFilter !== 'all') {
      filtered = filtered.filter(
        (event) => new Date(event.date).getFullYear() === parseInt(yearFilter)
      )
    }
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [statusFilter, yearFilter])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Events</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our past and upcoming events that bring our community together
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">
              {statusFilter !== 'all' || yearFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Check back later for upcoming events'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative">
                  {event.images && event.images.length > 0 ? (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Calendar className="text-white" size={64} />
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'upcoming'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>

                  {event.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                  )}

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-start text-gray-700">
                      <Clock className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-blue-600" />
                      <div>
                        <div className="font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>

                    {event.location && (
                      <div className="flex items-start text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-blue-600" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.images && event.images.length > 1 && (
                      <div className="flex items-center text-gray-700">
                        <ImageIcon className="w-5 h-5 mr-3 flex-shrink-0 text-blue-600" />
                        <span className="text-sm">{event.images.length} photos</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
