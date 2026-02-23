import Link from 'next/link'
import { ArrowRight, Users, Calendar, TrendingUp, Award, MapPin, Clock } from 'lucide-react'
import {
  mockEvents,
  mockAchievements,
  mockMembers,
  mockDonations,
} from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type Event = Database['public']['Tables']['events']['Row']
type Achievement = Database['public']['Tables']['achievements']['Row']

export default function Home() {
  const totalMembers = mockMembers.length
  const totalEvents = mockEvents.length
  const totalFunds = mockDonations.reduce((sum, d) => sum + Number(d.amount), 0)
  const upcomingEvents = mockEvents
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
  const featuredAchievements = [...mockAchievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to Our Society
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Building a community of excellence through collaboration, innovation, and shared growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/members"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg text-center"
              >
                Join Us
              </Link>
              <Link
                href="/events"
                className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-all transform hover:scale-105 border-2 border-white/20 text-center"
              >
                View Events
              </Link>
              <Link
                href="/donations"
                className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all transform hover:scale-105 border-2 border-white text-center"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Our Society</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                To create an inclusive community where every member can thrive, innovate, and contribute to meaningful change. We believe in fostering excellence through collaboration and continuous learning.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive to provide opportunities for personal and professional development, organize impactful events, recognize outstanding achievements, and build lasting connections among members. Together, we&apos;re shaping the future of our community.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-blue-600" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Community</h4>
                <p className="text-gray-600 text-sm">Building strong connections</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Growth</h4>
                <p className="text-gray-600 text-sm">Continuous improvement</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-purple-600" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h4>
                <p className="text-gray-600 text-sm">Celebrating achievements</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-orange-600" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Events</h4>
                <p className="text-gray-600 text-sm">Engaging activities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{totalMembers}</div>
              <div className="text-gray-600 font-medium">Active Members</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{totalEvents}</div>
              <div className="text-gray-600 font-medium">Events Organized</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹{totalFunds.toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Funds Raised</div>
            </div>
          </div>
        </div>
      </section>

      {featuredAchievements.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Achievements</h2>
                <div className="w-20 h-1 bg-blue-600"></div>
              </div>
              <Link
                href="/achievements"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group"
              >
                View All
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredAchievements.map((achievement: Achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  {achievement.image && (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Award className="text-blue-600" size={64} />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mb-3">
                      {achievement.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 font-medium mb-2">{achievement.member_name}</p>
                    {achievement.rank && (
                      <p className="text-blue-600 font-semibold mb-3">{achievement.rank}</p>
                    )}
                    <p className="text-gray-500 text-sm">
                      {new Date(achievement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
                <div className="w-20 h-1 bg-blue-600"></div>
              </div>
              <Link
                href="/events"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group"
              >
                View All
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event: Event) => (
                <div
                  key={event.id}
                  className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-blue-600 hover:shadow-lg transition-all"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Calendar className="text-white" size={64} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start text-gray-600">
                        <Clock className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
