'use client'

import { useState } from 'react'
import { Settings, Calendar, Award, Users as UsersIcon, Heart } from 'lucide-react'
import ManageEvents from '@/components/admin/ManageEvents'
import ManageAchievements from '@/components/admin/ManageAchievements'
import ManageMembers from '@/components/admin/ManageMembers'
import ManageDonations from '@/components/admin/ManageDonations'

type Tab = 'events' | 'achievements' | 'members' | 'donations'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('events')

  const tabs = [
    { id: 'events' as Tab, label: 'Events', icon: Calendar },
    { id: 'achievements' as Tab, label: 'Achievements', icon: Award },
    { id: 'members' as Tab, label: 'Members', icon: UsersIcon },
    { id: 'donations' as Tab, label: 'Donations', icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="text-blue-600" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">
            Manage events, achievements, members, and donations
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'events' && <ManageEvents />}
            {activeTab === 'achievements' && <ManageAchievements />}
            {activeTab === 'members' && <ManageMembers />}
            {activeTab === 'donations' && <ManageDonations />}
          </div>
        </div>
      </div>
    </div>
  )
}
