'use client'

import { useState } from 'react'
import { Settings, Calendar, Award, Users as UsersIcon, Heart, CheckCircle2, LayoutDashboard, Database, Activity } from 'lucide-react'
import ManageEvents from '@/components/admin/ManageEvents'
import ManageAchievements from '@/components/admin/ManageAchievements'
import ManageMembers from '@/components/admin/ManageMembers'
import ManageDonations from '@/components/admin/ManageDonations'
import ManageFamily from '@/components/admin/ManageFamily'

type Tab = 'events' | 'achievements' | 'members' | 'donations' | 'family'

const tabConfigs = [
  { id: 'events' as Tab, label: 'Events', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', activeBg: 'bg-blue-600' },
  { id: 'achievements' as Tab, label: 'Achievements', icon: Award, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100', activeBg: 'bg-pink-600' },
  { id: 'members' as Tab, label: 'Members', icon: UsersIcon, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', activeBg: 'bg-amber-600' },
  { id: 'donations' as Tab, label: 'Donations', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', activeBg: 'bg-rose-600' },
  { id: 'family' as Tab, label: 'Family', icon: UsersIcon, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', activeBg: 'bg-cyan-600' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('events')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
            <LayoutDashboard size={16} />
            Administrative Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Admin <span className="text-blue-600">Control Center</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your community's digital assets, members, and activities from a centralized dashboard.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {tabConfigs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10">
            {activeTab === 'events' && <ManageEvents />}
            {activeTab === 'achievements' && <ManageAchievements />}
            {activeTab === 'members' && <ManageMembers />}
            {activeTab === 'donations' && <ManageDonations />}
            {activeTab === 'family' && <ManageFamily />}
          </div>
        </div>
      </main>

      <footer className="py-12 bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Society Administrative Terminal</p>
        </div>
      </footer>
    </div>
  )
}
