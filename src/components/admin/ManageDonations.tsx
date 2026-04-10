'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Target } from 'lucide-react'
import { mockDonations } from '@/lib/mock-data'
import { DonationCreateService } from '@/services/donationCreate.service'
import { DonationService } from '@/services/donation.service'
import type { Database } from '@/lib/database.types'

type Donation = Database['public']['Tables']['donations']['Row']

interface DonationGoal {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  amount: number | string;
  status: string;
}

export default function ManageDonations() {
  const [donations, setDonations] = useState<any[]>([])
  const [goals, setGoals] = useState<DonationGoal[]>([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [goalFormData, setGoalFormData] = useState<Partial<DonationGoal>>({
    title: '',
    description: '',
    amount: 0,
    status: 'active',
  })

  useEffect(() => {
    fetchGoals()
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const response = await DonationCreateService.listDonations()
      if (response && response.data && response.data.data) {
        setDonations(response.data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchGoals = async () => {
    setIsLoading(true)
    try {
      const response = await DonationService.listDonation()
      if (response && response.data && response.data.data) {
        setGoals(response.data.data)
      } else if (response.error) {
        console.error('Failed to fetch goals:', response.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        title: goalFormData.title,
        description: goalFormData.description,
        amount: Number(goalFormData.amount),
        status: goalFormData.status
      }

      if (editingGoalId) {
        const response = await DonationService.updateDonation(editingGoalId, payload)
        if (response.error) {
          alert('Failed to update donation goal: ' + response.error)
        }
      } else {
        const response = await DonationService.createDonation(payload)
        console.log(response);

        if (response.error) {
          alert('Failed to create donation goal: ' + response.error)
        }
      }

      await fetchGoals()
      resetGoalForm()
    } catch (err) {
      console.error(err)
      alert('An error occurred while saving the donation goal.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditGoal = (goal: any) => {
    setGoalFormData({
      title: goal.title,
      description: goal.description,
      amount: Number(goal.amount),
      status: goal.status,
    })
    setEditingGoalId(goal._id || goal.id)
    setShowGoalForm(true)
  }

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    setIsLoading(true)
    try {
      const response = await DonationService.deleteDonation(id)
      if (response.error) {
        alert('Failed to delete goal: ' + response.error)
      } else {
        await fetchGoals()
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while deleting.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDonation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) return
    try {
      const response = await DonationCreateService.deleteDonation(id)
      if (response && !response.error) {
        await fetchDonations()
      } else {
        alert('Failed to delete donation: ' + response?.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const resetGoalForm = () => {
    setGoalFormData({
      title: '',
      description: '',
      amount: 0,
      status: 'active',
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
                    value={goalFormData.amount}
                    onChange={(e) => setGoalFormData({ ...goalFormData, amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={goalFormData.status}
                    onChange={(e) => setGoalFormData({ ...goalFormData, status: e.target.value })}
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
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No goals found. Add your first goal!</div>
          ) : (
            goals.map((goal) => {
              const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
              const progress = Number(goal.amount) > 0 ? Math.min((totalRaised / Number(goal.amount)) * 100, 100) : 0;
              return (
                <div
                  key={goal._id || goal.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="text-blue-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${goal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {goal.status === 'active' ? 'Active' : 'Inactive'}
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
                          <span className="text-gray-600">₹{totalRaised.toLocaleString()} raised</span>
                          <span className="text-gray-600">₹{Number(goal.amount).toLocaleString()} goal</span>
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
                        onClick={() => handleDeleteGoal(goal._id || goal.id as string)}
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
                key={donation._id || donation.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{donation.name || donation.donor_name}</h3>
                      <span className="text-lg font-bold text-green-600">
                        ₹{Number(donation.amount).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{donation.address || donation.email}</p>
                    <p className="text-sm text-gray-500">
                      {donation.date || donation.createdAt ? new Date(donation.date || donation.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      }) : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDonation(donation._id || donation.id as string)}
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
