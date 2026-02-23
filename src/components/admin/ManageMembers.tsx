'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { mockMembers } from '@/lib/mock-data'
import type { Database } from '@/lib/database.types'

type Member = Database['public']['Tables']['members']['Row']
type MemberInsert = Database['public']['Tables']['members']['Insert']

export default function ManageMembers() {
  const [members, setMembers] = useState<Member[]>([...mockMembers])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<MemberInsert>>({
    name: '',
    role: 'Member',
    joined_year: new Date().getFullYear(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    if (editingId) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? { ...m, ...formData, updated_at: now } as Member
            : m
        )
      )
    } else {
      const newMember: Member = {
        id: `mem-${Date.now()}`,
        name: formData.name!,
        role: formData.role ?? 'Member',
        photo: null,
        joined_year: formData.joined_year!,
        created_at: now,
        updated_at: now,
      }
      setMembers((prev) => [newMember, ...prev])
    }
    resetForm()
  }

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      role: member.role,
      joined_year: member.joined_year,
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Member',
      joined_year: new Date().getFullYear(),
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Members</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Member' : 'Add New Member'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Member">Member</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joined Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="2000"
                  max="2100"
                  value={formData.joined_year}
                  onChange={(e) => setFormData({ ...formData, joined_year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update Member' : 'Add Member'}
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
        {members.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No members found. Add your first member!</div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Joined {member.joined_year}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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
