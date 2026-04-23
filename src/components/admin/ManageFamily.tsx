'use client';

import React, { useState, useEffect } from 'react';
import { FamilyService } from '@/services/family.service';
import { AuthService } from '@/services/auth.service';
import { Users, Plus, Trash2, X, RefreshCw, User as UserIcon, Edit2, ChevronDown, ChevronRight, Briefcase, Calendar, Mail, UserPlus } from 'lucide-react';

export default function ManageFamily() {
  const [families, setFamilies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Form State
  const [selectedUserId, setSelectedUserId] = useState('');
  const [members, setMembers] = useState([
    { relation: '', name: '', occupation: '', age: '' }
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [familyRes, userRes] = await Promise.all([
        FamilyService.getAllFamilies(),
        AuthService.listUsers()
      ]);

      if (familyRes.data?.status) setFamilies(familyRes.data.data);
      if (userRes.data?.status) setUsers(userRes.data.data);
    } catch (err) {
      console.error(err);
      setError('Database connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMember = () => {
    setMembers([...members, { relation: '', name: '', occupation: '', age: '' }]);
  };

  const handleRemoveMember = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updated = [...members];
    (updated[index] as any)[field] = value;
    setMembers(updated);
  };

  const resetForm = () => {
    setSelectedUserId('');
    setMembers([{ relation: '', name: '', occupation: '', age: '' }]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (family: any) => {
    setSelectedUserId(family.authId?._id || '');
    setMembers(family.members || [{ relation: '', name: '', occupation: '', age: '' }]);
    setEditingId(family._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this family record?')) return;
    try {
      const res = await FamilyService.deleteFamilyRecord(id);
      if (res.data?.status) {
        alert('Family record deleted successfully.');
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete record.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (let m of members) {
      if (!m.name || !m.occupation || !m.age) {
        alert('Please fill in all member fields.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        id: editingId,
        authId: (selectedUserId && selectedUserId !== "") ? selectedUserId : null,
        members: members.map(m => ({ ...m, age: Number(m.age) }))
      };
      const res = await FamilyService.updateFamilyDetails(payload);
      if (res.data?.status) {
        alert(editingId ? 'Family record updated.' : 'New family record added.');
        resetForm();
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save family record.');
    } finally {
      setSaving(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Families</h2>
          <p className="text-sm text-gray-500 mt-1">Manage family members and relationships</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              showForm ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showForm ? <><X size={18} /> Cancel</> : <><UserPlus size={18} /> Add Family</>}
          </button>
          <button
            onClick={fetchData}
            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-xl p-8 border-2 border-blue-100 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            {editingId ? 'Edit Family Record' : 'Add New Family Record'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Member / Steward (Optional)</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              >
                <option value="">-- No User Assigned --</option>
                {users.map((user: any) => (
                  <option key={user._id} value={user._id}>{user.fullname} ({user.email})</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Family Members</h4>
                <button 
                  type="button" 
                  onClick={handleAddMember} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Plus size={14} /> Add Member
                </button>
              </div>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Relation</label>
                      <input 
                        type="text" 
                        value={member.relation} 
                        onChange={(e) => handleMemberChange(index, 'relation', e.target.value)} 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                        placeholder="e.g. Son, Daughter" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={member.name} 
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)} 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                        placeholder="Name" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Occupation</label>
                      <input 
                        type="text" 
                        required 
                        value={member.occupation} 
                        onChange={(e) => handleMemberChange(index, 'occupation', e.target.value)} 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                        placeholder="Profession" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Age</label>
                        <input 
                          type="number" 
                          required 
                          value={member.age} 
                          onChange={(e) => handleMemberChange(index, 'age', e.target.value)} 
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                          placeholder="Age" 
                        />
                      </div>
                      <div className="pt-5">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMember(index)} 
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          disabled={members.length === 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                disabled={saving} 
                type="submit" 
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
              >
                {saving ? 'Saving...' : (editingId ? 'Update Record' : 'Save Record')}
              </button>
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-8 bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Family Representative</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
              ) : families.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-500 italic">No family records found.</td></tr>
              ) : families.map((family: any) => (
                <React.Fragment key={family._id}>
                  <tr 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedRow === family._id ? 'bg-blue-50/30' : ''}`} 
                    onClick={() => toggleRow(family._id)}
                  >
                    <td className="px-6 py-5">
                      <div className={`p-1 rounded-md transition-colors ${expandedRow === family._id ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
                        {expandedRow === family._id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{family.authId?.fullname || 'Unnamed Record'}</div>
                          <div className="text-xs text-gray-500">{family.authId?.email || 'No email associated'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {family.members?.slice(0, 2).map((m: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium border border-gray-200">
                            {m.relation}
                          </span>
                        ))}
                        {family.members?.length > 2 && <span className="text-[10px] text-gray-400">+{family.members.length - 2} more</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-900">{family.members?.length || 0}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(family); }} 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(family._id); }} 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRow === family._id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="px-12 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {family.members?.map((m: any, idx: number) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-sm font-bold text-gray-900">{m.name}</div>
                                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{m.relation}</div>
                                </div>
                                <div className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Member {idx + 1}</div>
                              </div>
                              <div className="space-y-1.5 pt-2 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Briefcase size={12} className="text-gray-400" />
                                  <span>{m.occupation}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Calendar size={12} className="text-gray-400" />
                                  <span>{m.age} years old</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
