'use client'

import { useState } from 'react'
import { Heart, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { mockDonations, mockDonationGoals } from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type DonationGoal = Database['public']['Tables']['donation_goals']['Row']

const tiers = [
  { amount: 100, label: '₹100' },
  { amount: 500, label: '₹500' },
  { amount: 1000, label: '₹1,000' },
  { amount: 0, label: 'Custom' },
]

export default function DonationsPage() {
  const activeGoal = mockDonationGoals.find((g) => g.is_active) ?? mockDonationGoals[0] ?? null
  const recentDonations = [...mockDonations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const [formData, setFormData] = useState({
    donor_name: '',
    email: '',
    amount: '',
  })
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleTierSelect = (amount: number) => {
    setSelectedTier(amount)
    if (amount > 0) {
      setFormData({ ...formData, amount: amount.toString() })
    } else {
      setFormData({ ...formData, amount: '' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setShowSuccess(true)
      setFormData({ donor_name: '', email: '', amount: '' })
      setSelectedTier(null)
      setSubmitting(false)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 500)
  }

  const progressPercentage = activeGoal
    ? Math.min((activeGoal.current_amount / activeGoal.goal_amount) * 100, 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Support Our Mission</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your generous contributions help us create meaningful impact in our community
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-8">
            {activeGoal && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{activeGoal.title}</h2>
                    {activeGoal.description && (
                      <p className="text-gray-600">{activeGoal.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-blue-600">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        ₹{activeGoal.current_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">raised</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-700">
                        ₹{activeGoal.goal_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">goal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {recentDonations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Supporters</h2>
                </div>
                <div className="space-y-4">
                  {recentDonations.slice(0, 5).map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{donation.donor_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-green-600 font-semibold">
                        ₹{Number(donation.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="text-pink-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
            </div>

            {showSuccess ? (
              <div className="text-center py-12">
                <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  Your generous contribution makes a real difference in our community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {tiers.map((tier) => (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => handleTierSelect(tier.amount)}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          selectedTier === tier.amount
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.donor_name}
                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData({ ...formData, amount: e.target.value })
                      setSelectedTier(null)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Donate Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
