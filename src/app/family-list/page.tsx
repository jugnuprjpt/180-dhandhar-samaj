'use client';

import React, { useState, useEffect } from 'react';
import { FamilyService } from '@/services/family.service';
import { Users, User, Briefcase, Calendar, Search, Loader2, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FamilyListPage() {
  const router = useRouter();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const res = await FamilyService.getAllFamilies();
        if (res.data?.status) {
          setFamilies(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch families', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFamilies();
  }, []);

  const filteredFamilies = families.filter((f: any) => {
    const mainPerson = f.authId?.fullname || (f.members && f.members[0]?.name) || '';
    const occupationMatch = f.members?.some((m: any) => m.occupation.toLowerCase().includes(searchQuery.toLowerCase())) || false;
    return mainPerson.toLowerCase().includes(searchQuery.toLowerCase()) || occupationMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-blue-600" size={48} />
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Loading Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={12} />
                Official Directory
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Family Directory</h1>
              <p className="text-gray-500 max-w-2xl">
                Explore and connect with families in our community. Access professional information and family backgrounds.
              </p>
            </div>
            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search families or occupations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredFamilies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
            <Users className="text-gray-200 mb-6" size={80} />
            <h3 className="text-2xl font-bold text-gray-900">No families found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search query.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFamilies.map((family: any, i: number) => {
              const mainPersonName = family.authId?.fullname || (family.members && family.members[0]?.name) || 'Anonymous';
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center"
                >
                  <div className="mb-4">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border-4 border-gray-50 shadow-sm">
                      <User size={40} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{mainPersonName}</h3>
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase inline-block">
                      {family.members?.length || 0} Family Members
                    </div>
                  </div>

                  <div className="w-full space-y-2 mt-2 pt-4 border-t border-gray-50">
                    {family.members?.slice(0, 2).map((member: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-gray-700 uppercase">{member.relation}</span>
                        <span className="text-gray-500 truncate max-w-[100px]">{member.name}</span>
                      </div>
                    ))}
                    {family.members?.length > 2 && (
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-1">
                        + {family.members.length - 2} More
                      </div>
                    )}
                  </div>

                  {family.authId?.email && (
                    <a
                      href={`mailto:${family.authId.email}`}
                      className="mt-4 text-[11px] font-bold text-blue-600 hover:underline uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Mail size={12} /> Contact
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Register Your Family Details
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Help us build a complete community directory. Register your family members to maintain our lineage archive.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push('/family-details')}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-600/20"
            >
              Add My Family
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all cursor-pointer border border-white/10"
            >
              Back to Top
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Official Family Repository</p>
        </div>
      </footer>
    </div>
  );
}
