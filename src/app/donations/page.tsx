'use client'

import { useState, useEffect } from 'react'
import { Heart, TrendingUp, Users, CheckCircle2, ChevronRight } from 'lucide-react'
import { DonationCreateService } from '@/services/donationCreate.service'
import { DonationService } from '@/services/donation.service'

const tiers = [
  { amount: 100, label: '₹100' },
  { amount: 500, label: '₹500' },
  { amount: 1000, label: '₹1,000' },
  { amount: 0, label: 'Custom' },
]

export default function DonationsPage() {
  const [activeGoal, setActiveGoal] = useState<any>(null)
  const [recentDonations, setRecentDonations] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    amount: '',
  })
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchGoals()
    fetchRecentDonations()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await DonationService.listDonation()
      if (response && response.data && response.data.data) {
        const goal = response.data.data.find((g: any) => g.status === 'active') || response.data.data[0] || null
        setActiveGoal(goal)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchRecentDonations = async () => {
    try {
      const response = await DonationCreateService.listDonations()
      if (response && response.data && response.data.data) {
        const sorted = response.data.data.sort(
          (a: any, b: any) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
        )
        setRecentDonations(sorted)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleTierSelect = (amount: number) => {
    setSelectedTier(amount)
    if (amount > 0) {
      setFormData({ ...formData, amount: amount.toString() })
    } else {
      setFormData({ ...formData, amount: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        amount: Number(formData.amount)
      }

      const response = await DonationCreateService.createDonation(payload);

      if (response && !response.error) {
        setShowSuccess(true)
        setFormData({ name: '', address: '', amount: '' })
        setSelectedTier(null)
        await fetchRecentDonations()
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        throw new Error(response.error || 'Failed to submit donation')
      }
    } catch (error) {
      console.error('Donation error:', error)
      alert("Failed to submit donation.")
    } finally {
      setSubmitting(false)
    }
  }

  const current_amount = recentDonations.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  const progressPercentage = activeGoal && Number(activeGoal.amount) > 0
    ? Math.min((current_amount / Number(activeGoal.amount)) * 100, 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
            <Heart size={16} />
            Support Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Make a <span className="text-blue-600">Difference</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your contributions help us fund community events, support members in need, and grow our shared initiatives.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Progress & Goals */}
          <div className="lg:col-span-7 space-y-12">
            {activeGoal && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{activeGoal.title}</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Raised So Far</p>
                      <p className="text-4xl font-bold text-gray-900">₹{current_amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Target Goal</p>
                      <p className="text-2xl font-bold text-gray-700">₹{Number(activeGoal.amount).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                    <span>Goal: {activeGoal.status}</span>
                    <span className="text-blue-600">{progressPercentage.toFixed(1)}% Completed</span>
                  </div>
                </div>

                <p className="mt-8 text-gray-600 border-t border-gray-50 pt-6">
                  {activeGoal.description}
                </p>
              </div>
            )}

            {/* Honor Roll */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} />
                Recent Contributors
              </h2>
              <div className="grid gap-4">
                {recentDonations.slice(0, 5).map((donation) => (
                  <div
                    key={donation._id || donation.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{donation.name || donation.donor_name}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                          Verified Donation • {new Date(donation.date || donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{Number(donation.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 sticky top-24">
              {showSuccess ? (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
                  <p className="text-gray-600">Your generous contribution has been recorded.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">Quick Donate</h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {tiers.map((tier) => (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => handleTierSelect(tier.amount)}
                        className={`py-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          selectedTier === tier.amount
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        placeholder="Your Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Amount (₹)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.amount}
                        onChange={(e) => {
                          setFormData({ ...formData, amount: e.target.value })
                          setSelectedTier(null)
                        }}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Contact/Address</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        placeholder="Email or Location"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Processing...' : 'Complete Donation'}
                    <ChevronRight size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
