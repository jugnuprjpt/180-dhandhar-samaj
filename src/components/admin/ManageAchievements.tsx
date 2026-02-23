'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { mockAchievements } from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type Achievement = Database['public']['Tables']['achievements']['Row']
type AchievementInsert = Database['public']['Tables']['achievements']['Insert']

export default function ManageAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([...mockAchievements])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<AchievementInsert>>({
    member_name: '',
    title: '',
    rank: '',
    description: '',
    date: '',
    category: 'Academic',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    if (editingId) {
      setAchievements((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, ...formData, updated_at: now } as Achievement
            : a
        )
      )
    } else {
      const newAchievement: Achievement = {
        id: `ach-${Date.now()}`,
        member_name: formData.member_name!,
        title: formData.title!,
        rank: formData.rank ?? null,
        description: formData.description ?? null,
        date: formData.date!,
        category: (formData.category as Achievement['category']) ?? 'Academic',
        image: null,
        created_at: now,
        updated_at: now,
      }
      setAchievements((prev) => [newAchievement, ...prev])
    }
    resetForm()
  }

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      member_name: achievement.member_name,
      title: achievement.title,
      rank: achievement.rank,
      description: achievement.description,
      date: achievement.date.split('T')[0],
      category: achievement.category,
    })
    setEditingId(achievement.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return
    setAchievements((prev) => prev.filter((a) => a.id !== id))
  }

  const resetForm = () => {
    setFormData({
      member_name: '',
      title: '',
      rank: '',
      description: '',
      date: '',
      category: 'Academic',
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Achievements</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Achievement
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Achievement' : 'Add New Achievement'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.member_name}
                  onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as 'Academic' | 'Sports' | 'Cultural' | 'Other',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rank/Award</label>
                <input
                  type="text"
                  value={formData.rank || ''}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="e.g., 1st Place, Gold Medal"
                />
              </div>
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
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update Achievement' : 'Add Achievement'}
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
        {achievements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No achievements found. Add your first achievement!
          </div>
        ) : (
          achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{achievement.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {achievement.category}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">{achievement.member_name}</p>
                  {achievement.rank && (
                    <p className="text-blue-600 font-semibold mb-2">{achievement.rank}</p>
                  )}
                  {achievement.description && (
                    <p className="text-gray-600 mb-3">{achievement.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
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
