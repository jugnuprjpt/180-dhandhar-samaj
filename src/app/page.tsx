'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Calendar, TrendingUp, Award, MapPin, Clock, Heart } from 'lucide-react'
import { DonationCreateService } from '@/services/donationCreate.service'
import { MemberService } from '@/services/member.service'
import { AchievementService } from '@/services/achievement.service'
import { EventService } from '@/services/event.service'
import type { Database } from '@/lib/database.types'

type Event = Database['public']['Tables']['events']['Row']
type Achievement = Database['public']['Tables']['achievements']['Row']

export default function Home() {
  const [activeMembersCount, setActiveMembersCount] = useState<number | string>('...')
  const [featuredAchievements, setFeaturedAchievements] = useState<Achievement[]>([])
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [totalEventsCount, setTotalEventsCount] = useState<number | string>('...')
  const [totalFunds, setTotalFunds] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, achievementsRes, pastEventsRes, upcomingEventsRes, donationsRes] = await Promise.all([
          MemberService.listMemberByRole('member'),
          AchievementService.listAchievement(),
          EventService.listEventByStatus('past'),
          EventService.listEventByStatus('upcoming'),
          DonationCreateService.listDonations()
        ])

        if (membersRes?.data?.data) setActiveMembersCount(membersRes.data.data.length)
        else setActiveMembersCount(0)

        if (achievementsRes?.data?.data) {
          const sorted = [...achievementsRes.data.data]
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
          setFeaturedAchievements(sorted)
        }

        if (pastEventsRes?.data?.data) setTotalEventsCount(pastEventsRes.data.data.length)
        else setTotalEventsCount(0)

        if (upcomingEventsRes?.data?.data) {
          const sorted = [...upcomingEventsRes.data.data]
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3)
          setUpcomingEvents(sorted)
        }

        if (donationsRes?.data?.data) {
          const sum = donationsRes.data.data.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0)
          setTotalFunds(sum)
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err)
      } finally {
        setIsLoadingAchievements(false)
        setIsLoadingEvents(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to Our <span className="text-blue-600">Community Portal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Connecting members, celebrating achievements, and building a stronger future together through unity and excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
              >
                Get Started
              </Link>
              <Link
                href="/about-us"
                className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-3xl font-bold text-blue-900 mb-1">{activeMembersCount}+</div>
              <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Active Members</div>
            </div>
            <div className="p-8 rounded-xl bg-green-50 border border-green-100">
              <div className="text-3xl font-bold text-green-900 mb-1">{totalEventsCount}+</div>
              <div className="text-sm font-semibold text-green-600 uppercase tracking-wider">Events Held</div>
            </div>
            <div className="p-8 rounded-xl bg-purple-50 border border-purple-100">
              <div className="text-3xl font-bold text-purple-900 mb-1">₹{totalFunds.toLocaleString()}</div>
              <div className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Total Donations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Community', desc: 'Join our growing network of dedicated members.', color: 'text-blue-600', bg: 'bg-blue-100' },
              { icon: Award, title: 'Achievements', desc: 'Recognizing excellence in various fields.', color: 'text-yellow-600', bg: 'bg-yellow-100' },
              { icon: Calendar, title: 'Events', desc: 'Stay updated with our latest gatherings.', color: 'text-green-600', bg: 'bg-green-100' },
              { icon: Heart, title: 'Donations', desc: 'Support our mission through contributions.', color: 'text-red-600', bg: 'bg-red-100' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`${feature.bg} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Achievements */}
      {featuredAchievements.length > 0 && (
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Achievements</h2>
                <p className="text-gray-600 mt-2">Celebrating excellence in our community</p>
              </div>
              <Link href="/achievements" className="text-blue-600 font-semibold flex items-center gap-2 hover:underline cursor-pointer">
                View All <ArrowRight size={20} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredAchievements.map((achievement: any) => (
                <div key={achievement._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                      <Award size={16} />
                      {achievement.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{achievement.memberName || achievement.member_name}</p>
                    <div className="text-xs text-gray-400 font-medium">
                      {new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                <p className="text-gray-600 mt-2">Join us in our next community gathering</p>
              </div>
              <Link href="/events" className="text-blue-600 font-semibold flex items-center gap-2 hover:underline cursor-pointer">
                Full Calendar <ArrowRight size={20} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((event: any) => (
                <div key={event._id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-blue-600 text-white p-3 rounded-lg text-center min-w-[60px]">
                        <div className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</div>
                        <div className="text-[10px] uppercase font-bold mt-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                        Upcoming
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <Clock size={16} />
                        {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-3">
                          <MapPin size={16} />
                          {event.location}
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
