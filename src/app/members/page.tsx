'use client'

import { useMemo, useState, useEffect } from 'react'
import { Users, Search, UserCircle, CheckCircle2 } from 'lucide-react'
import { MemberService } from '@/services/member.service'

interface Member {
  _id: string;
  name: string;
  role: string;
  year: number;
  photo?: string | null;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const response = await MemberService.listMember()
      if (response && response.data && response.data.data) {
        setMembers(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const availableRoles = useMemo(
    () => Array.from(new Set(members.map((m) => m.role))).filter(r => r),
    [members]
  )

  const filteredMembers = useMemo(() => {
    let filtered = [...members]
    if (roleFilter !== 'all') {
      filtered = filtered.filter((m) => m.role === roleFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(q))
    }
    return filtered.sort((a, b) => {
      if (a.role !== b.role) return a.role.localeCompare(b.role)
      return a.name.localeCompare(b.name)
    })
  }, [members, roleFilter, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
            <Users size={16} />
            Our Community Team
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our <span className="text-blue-600">Members</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the dedicated individuals who contribute to our community's success and growth.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 ${
                  roleFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Roles
              </button>
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 ${
                    roleFilter === role
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {role.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-medium animate-pulse">
            Loading member registry...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Users className="mx-auto text-gray-200 mb-6" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your search or filter settings.</p>
            <button
              onClick={() => { setRoleFilter('all'); setSearchQuery(''); }}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center"
              >
                <div className="mb-4 flex justify-center">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <UserCircle size={48} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="space-y-1 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{member.name}</h3>
                  <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase inline-block">
                    {member.role.replace(/-/g, ' ')}
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-400">
                  Member Since {member.year}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
