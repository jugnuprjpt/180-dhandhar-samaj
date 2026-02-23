'use client'

import { useMemo, useState } from 'react'
import { Award, Trophy, Medal, Star } from 'lucide-react'
import { mockAchievements } from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type Achievement = Database['public']['Tables']['achievements']['Row']

const categoryIcons = {
  Academic: Trophy,
  Sports: Medal,
  Cultural: Star,
  Other: Award,
}

const categoryColors = {
  Academic: 'from-blue-500 to-cyan-500',
  Sports: 'from-green-500 to-emerald-500',
  Cultural: 'from-purple-500 to-pink-500',
  Other: 'from-orange-500 to-amber-500',
}

const categories = ['Academic', 'Sports', 'Cultural', 'Other']

export default function AchievementsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredAchievements = useMemo(() => {
    if (categoryFilter === 'all') return [...mockAchievements]
    return mockAchievements.filter((a) => a.category === categoryFilter)
  }, [categoryFilter])

  const sortedAchievements = useMemo(
    () =>
      [...filteredAchievements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [filteredAchievements]
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Achievements</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating the outstanding accomplishments of our members
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons]
            return (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  categoryFilter === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {category}
              </button>
            )
          })}
        </div>

        {sortedAchievements.length === 0 ? (
          <div className="text-center py-16">
            <Award className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Achievements Found</h3>
            <p className="text-gray-600">
              {categoryFilter !== 'all'
                ? 'Try selecting a different category'
                : 'Check back later for new achievements'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAchievements.map((achievement) => {
              const Icon = categoryIcons[achievement.category as keyof typeof categoryIcons]
              const gradient = categoryColors[achievement.category as keyof typeof categoryColors]

              return (
                <div
                  key={achievement.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    {achievement.image ? (
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="text-white" size={64} />
                    )}
                  </div>

                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mb-3">
                      {achievement.category}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>

                    <p className="text-gray-700 font-medium mb-3">{achievement.member_name}</p>

                    {achievement.rank && (
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy className="text-yellow-500" size={18} />
                        <span className="text-blue-600 font-semibold">{achievement.rank}</span>
                      </div>
                    )}

                    {achievement.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {achievement.description}
                      </p>
                    )}

                    <div className="border-t pt-4">
                      <p className="text-gray-500 text-sm">
                        {new Date(achievement.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
