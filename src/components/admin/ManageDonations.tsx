'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Target } from 'lucide-react'
import { mockDonations, mockDonationGoals } from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type Donation = Database['public']['Tables']['donations']['Row']
type DonationGoal = Database['public']['Tables']['donation_goals']['Row']
type DonationGoalInsert = Database['public']['Tables']['donation_goals']['Insert']

export default function ManageDonations() {
  const [donations, setDonations] = useState<Donation[]>([...mockDonations])
  const [goals, setGoals] = useState<DonationGoal[]>([...mockDonationGoals])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [goalFormData, setGoalFormData] = useState<Partial<DonationGoalInsert>>({
    title: '',
    description: '',
    goal_amount: 0,
    is_active: true,
  })

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    if (editingGoalId) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoalId
            ? { ...g, ...goalFormData, updated_at: now } as DonationGoal
            : g
        )
      )
    } else {
      const newGoal: DonationGoal = {
        id: `goal-${Date.now()}`,
        goal_amount: goalFormData.goal_amount ?? 0,
        current_amount: 0,
        title: goalFormData.title ?? '',
        description: goalFormData.description ?? null,
        is_active: goalFormData.is_active ?? true,
        created_at: now,
        updated_at: now,
      }
      setGoals((prev) => [newGoal, ...prev])
    }
    resetGoalForm()
  }

  const handleEditGoal = (goal: DonationGoal) => {
    setGoalFormData({
      title: goal.title,
      description: goal.description,
      goal_amount: goal.goal_amount,
      is_active: goal.is_active,
    })
    setEditingGoalId(goal.id)
    setShowGoalForm(true)
  }

  const handleDeleteGoal = (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const handleDeleteDonation = (id: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) return
    setDonations((prev) => prev.filter((d) => d.id !== id))
  }

  const resetGoalForm = () => {
    setGoalFormData({
      title: '',
      description: '',
      goal_amount: 0,
      is_active: true,
    })
    setEditingGoalId(null)
    setShowGoalForm(false)
  }

  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0)

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Donation Goals</h2>
          <button
            onClick={() => setShowGoalForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Goal
          </button>
        </div>

        {showGoalForm && (
          <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingGoalId ? 'Edit Goal' : 'Add New Goal'}
              </h3>
              <button onClick={resetGoalForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={goalFormData.title}
                  onChange={(e) => setGoalFormData({ ...goalFormData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={goalFormData.description || ''}
                  onChange={(e) => setGoalFormData({ ...goalFormData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={goalFormData.goal_amount}
                    onChange={(e) => setGoalFormData({ ...goalFormData, goal_amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={goalFormData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setGoalFormData({ ...goalFormData, is_active: e.target.value === 'active' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingGoalId ? 'Update Goal' : 'Add Goal'}
                </button>
                <button
                  type="button"
                  onClick={resetGoalForm}
                  className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No goals found. Add your first goal!</div>
          ) : (
            goals.map((goal) => {
              const progress = (goal.current_amount / goal.goal_amount) * 100
              return (
                <div
                  key={goal.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="text-blue-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            goal.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {goal.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {goal.description && <p className="text-gray-600 mb-4">{goal.description}</p>}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-blue-600">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">₹{goal.current_amount.toLocaleString()} raised</span>
                          <span className="text-gray-600">₹{goal.goal_amount.toLocaleString()} goal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Donations</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: ₹{totalDonations.toLocaleString()} from {donations.length} donations
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {donations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No donations yet.</div>
          ) : (
            donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{donation.donor_name}</h3>
                      <span className="text-lg font-bold text-green-600">
                        ₹{Number(donation.amount).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{donation.email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDonation(donation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
