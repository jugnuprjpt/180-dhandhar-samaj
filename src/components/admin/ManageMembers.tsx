'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { MemberService } from '@/services/member.service'

interface Member {
  _id: string;
  name: string;
  role: string;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function ManageMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '',
    role: 'member',
    year: new Date().getFullYear(),
  })

  const fetchMembers = async () => {
    const response = await MemberService.listMember();
    if (response.data && response.data.data) {
      setMembers(response.data.data);
    } else if (response.error) {
      console.error("Failed to fetch members:", response.error);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    let response;
    if (editingId) {
      response = await MemberService.updateMember(editingId, formData);
    } else {
      response = await MemberService.createMember(formData);
    }

    if (response.error) {
      console.error("Failed to save member:", response.error);
      alert(response.error || "An error occurred while saving.");
    } else {
      fetchMembers();
      resetForm();
    }
    setIsLoading(false)
  }

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      role: member.role,
      year: member.year,
    })
    setEditingId(member._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return
    const response = await MemberService.deleteMember(id);
    if (response.error) {
      console.error("Failed to delete member:", response.error);
      alert(response.error || "An error occurred while deleting.");
    } else {
      fetchMembers();
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'member',
      year: new Date().getFullYear(),
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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 cursor-pointer">
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
                  <option value="presidant">President</option>
                  <option value="vice-presidant">Vice President</option>
                  <option value="secretary">Secretary</option>
                  <option value="Joint Secretary">Joint Secretary</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
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
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Saving...' : (editingId ? 'Update Member' : 'Add Member')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
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
              key={member._id}
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
                  <p className="text-sm text-gray-500">Joined {member.year}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
