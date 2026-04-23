'use client';

import React, { useState, useEffect } from 'react';
import { FamilyService } from '@/services/family.service';
import { Plus, Trash2, Save, User, Users, Briefcase, Calendar, Heart, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Member {
    relation: string;
    name: string;
    occupation: string;
    age: string | number;
}

export default function FamilyDetailsPage() {
    const router = useRouter();
    const [authId, setAuthId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [members, setMembers] = useState<Member[]>([
        { relation: '', name: '', occupation: '', age: '' }
    ]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload && payload.id) {
                    setAuthId(payload.id);
                    setLoading(false);
                }
            } catch (e) {
                console.error('Failed to parse token', e);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const handleAddMember = () => {
        setMembers([...members, { relation: '', name: '', occupation: '', age: '' }]);
    };

    const handleRemoveMember = (index: number) => {
        const updatedMembers = [...members];
        updatedMembers.splice(index, 1);
        setMembers(updatedMembers);
    };

    const handleMemberChange = (index: number, field: string, value: string) => {
        const updatedMembers = [...members];
        (updatedMembers[index] as any)[field] = value;
        setMembers(updatedMembers);
    };

    const handleSave = async () => {
        for (let m of members) {
            if (!m.name || !m.occupation || !m.age) {
                toast.error('Please fill all fields for all members.');
                return;
            }
            if (isNaN(Number(m.age)) || Number(m.age) <= 0) {
                toast.error('Please enter a valid age number.');
                return;
            }
        }

        setSaving(true);
        try {
            const payload = {
                authId: authId || null,
                members: members.map(m => ({ ...m, age: Number(m.age) }))
            };
            const res = await FamilyService.updateFamilyDetails(payload);
            if (res.data?.status) {
                toast.success('Family details saved successfully!');
                setMembers([{ relation: '', name: '', occupation: '', age: '' }]);
                setTimeout(() => {
                    router.push('/family-list');
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to save details. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="animate-spin text-blue-600" size={48} />
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Loading Form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 size={12} />
                            Family Registration
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Register Your Family</h1>
                        <p className="text-gray-500 max-w-2xl">
                            Register your family details to help us maintain a complete community record.
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight">Family Members</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Add details of all family members</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddMember}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                        >
                            <Plus size={18} /> Add Member
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {members.map((member, index) => (
                            <div key={index} className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-4 h-px bg-gray-300"></div> Member #{index + 1}
                                    </h4>
                                    {members.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveMember(index)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                            title="Remove Member"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 px-1">Relation</label>
                                        <input
                                            type="text"
                                            value={member.relation}
                                            onChange={(e) => handleMemberChange(index, 'relation', e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="e.g. Son, Daughter"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 px-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Name"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 px-1">Occupation</label>
                                        <input
                                            type="text"
                                            required
                                            value={member.occupation}
                                            onChange={(e) => handleMemberChange(index, 'occupation', e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Profession"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600 px-1">Age</label>
                                        <input
                                            type="number"
                                            required
                                            value={member.age}
                                            onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Years"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t border-gray-100">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="animate-spin" size={20} /> : <><Save size={20} /> Save Details</>}
                            </button>
                            <button
                                onClick={() => router.push('/family-list')}
                                className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                View Directory <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                             Privacy Secured • Community Repository
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
