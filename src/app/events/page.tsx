'use client'

import { useMemo, useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, ArrowRight, ChevronDown } from 'lucide-react'
import { EventService } from '@/services/event.service'
import Link from 'next/link'

interface Event {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  status: string;
  images?: string[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [yearFilter, setYearFilter] = useState<string>('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const response = await EventService.listEvent()
      if (response && response.data && response.data.data) {
        setEvents(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(events.map((event) => new Date(event.date).getFullYear()))
    ).sort((a, b) => b - a)
    return years
  }, [events])

  const filteredEvents = useMemo(() => {
    let filtered = [...events]
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
  }, [events, statusFilter, yearFilter])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
            <Calendar size={16} />
            Community Gathering
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay connected with our community through upcoming gatherings and revisit our past shared experiences.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-auto">
              {[
                { label: 'All', value: 'all' },
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Past', value: 'past' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value as any)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    statusFilter === tab.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year:</span>
              <div className="relative flex-1 md:w-48">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 uppercase tracking-wider focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer"
                >
                  <option value="all">Full Timeline</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-medium animate-pulse">
            Loading event calendar...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Calendar className="mx-auto text-gray-200 mb-6" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your filters or check back later.</p>
            <button
              onClick={() => { setStatusFilter('all'); setYearFilter('all'); }}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id || event.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                {/* Date Header Image */}
                <div className="h-48 relative bg-gray-100">
                  {event.images && event.images.length > 0 ? (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="text-gray-200" size={64} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-50 flex flex-col items-center min-w-[55px]">
                    <span className="text-xl font-bold text-gray-900 leading-none">{new Date(event.date).getDate()}</span>
                    <span className="text-[10px] font-bold uppercase text-blue-600 mt-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      event.status === 'upcoming'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Clock size={16} />
                      <span className="text-sm font-medium">
                        {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-3 text-gray-500">
                        <MapPin size={16} />
                        <span className="text-sm font-medium line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 border-l-2 border-blue-100 pl-3">
                      {event.description}
                    </p>
                  )}


                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
