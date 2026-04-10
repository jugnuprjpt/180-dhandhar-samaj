'use client'

import { useMemo, useState, useEffect } from 'react'
import { Users, Search, UserCircle } from 'lucide-react'
import { MemberService } from '@/services/member.service'

interface Member {
  _id: string;
  name: string;
  role: string;
  year: number;
  photo?: string | null;
}

const getRoleColor = (role: string) => {
  const roleColors: { [key: string]: string } = {
    presidant: 'from-purple-500 to-pink-500',
    'vice-presidant': 'from-blue-500 to-cyan-500',
    secretary: 'from-green-500 to-emerald-500',
    'Joint Secretary': 'from-cyan-500 to-teal-500',
    admin: 'from-orange-500 to-amber-500',
    member: 'from-gray-500 to-slate-500',
  }
  return roleColors[role] || 'from-gray-500 to-slate-500'
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
      } else if (response.error) {
        console.error('Failed to fetch members:', response.error)
      }
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const availableRoles = useMemo(
    () => Array.from(new Set(members.map((m) => m.role))),
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Team</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated members who make our society thrive
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search members by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="md:w-64">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role} className="capitalize">
                    {role.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Members...</h3>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Members Found</h3>
            <p className="text-gray-600">
              {searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No members available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member: Member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className={`h-32 bg-gradient-to-br ${getRoleColor(member.role)} flex items-center justify-center`}>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <UserCircle className="text-white" size={80} />
                  )}
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>

                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-3 capitalize">
                    {member.role.replace('-', ' ')}
                  </div>

                  <div className="text-gray-600 text-sm">
                    <p>Joined {member.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
