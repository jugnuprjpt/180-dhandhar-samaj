'use client'

import { useMemo, useState, useEffect } from 'react'
import { Award, Trophy, Medal, Star, CheckCircle2, ArrowRight } from 'lucide-react'
import { AchievementService } from '@/services/achievement.service'
import Link from 'next/link'

interface Achievement {
  _id?: string;
  id?: string;
  memberName: string;
  member_name?: string;
  title: string;
  rank?: string;
  description?: string;
  date: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Other';
  image?: string | null;
}

const categoryIcons = {
  Academic: Trophy,
  Sports: Medal,
  Cultural: Star,
  Other: Award,
}

const categories = ['Academic', 'Sports', 'Cultural', 'Other']

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    setIsLoading(true)
    try {
      const response = await AchievementService.listAchievement()
      if (response && response.data && response.data.data) {
        setAchievements(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching achievements:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAchievements = useMemo(() => {
    if (categoryFilter === 'all') return [...achievements]
    return achievements.filter((a) => a.category === categoryFilter)
  }, [achievements, categoryFilter])

  const sortedAchievements = useMemo(
    () =>
      [...filteredAchievements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [filteredAchievements]
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
            <Trophy size={16} />
            Hall of Achievements
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Celebrating <span className="text-blue-600">Excellence</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Honoring the outstanding contributions and successes of our community members across all fields of endeavor.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scollbar-hide">
          <div className="flex items-center gap-2 min-w-max pb-1 sm:pb-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Merits
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons]
              return (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                    categoryFilter === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={14} />
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-medium animate-pulse">
            Retrieving achievements...
          </div>
        ) : sortedAchievements.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Award className="mx-auto text-gray-200 mb-6" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-500 mb-8">No records match the selected category.</p>
            <button
              onClick={() => setCategoryFilter('all')}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all cursor-pointer"
            >
              Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedAchievements.map((achievement: any) => {
              const Icon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Award

              return (
                <div
                  key={achievement._id || achievement.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Icon size={24} />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-400">{new Date(achievement.date).getFullYear()}</div>
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{achievement.category}</div>
                      </div>
                    </div>

                    {achievement.rank && (
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase rounded-md mb-3">
                        {achievement.rank}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {achievement.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-bold text-gray-700">{achievement.memberName || achievement.member_name}</span>
                    </div>

                    {achievement.description && (
                      <p className="text-gray-600 text-sm italic line-clamp-3 mb-6">
                        "{achievement.description}"
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-auto p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      ID: {String(achievement._id || achievement.id).slice(-4)}
                    </span>
                    <CheckCircle2 size={16} className="text-blue-500" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
