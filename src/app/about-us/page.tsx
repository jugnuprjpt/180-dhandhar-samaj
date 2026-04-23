'use client';

import React from 'react';
import { ShieldCheck, History, Heart, Users, Award, Zap, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* Professional Hero Section */}
      <section className="relative pt-24 pb-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 -skew-x-12 translate-x-20 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
               Establishing Excellence Since 1995
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Our Story, Our Legacy, <br/>
              <span className="text-blue-600">Our Community.</span>
            </h1>
            <p className="text-slate-500 text-xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Discover the history and the heartbeat behind our society. From humble beginnings to a thriving community of over 10,000 members.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
               <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-3 -z-10 opacity-5 group-hover:rotate-6 transition-transform duration-500"></div>
               <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100">
                  <div className="aspect-[4/5] bg-slate-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                      alt="Society Professional Team" 
                      className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white p-8 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-50 hidden md:flex flex-col justify-center">
                  <p className="text-4xl font-black text-blue-600 leading-none">25+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Years of Impact</p>
               </div>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900">A Journey of Growth</h2>
                  <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                </div>
                
                <p className="text-slate-500 leading-relaxed text-lg">
                  Founded in 1995 with just a handful of visionaries, our society was built on the fundamental principle of "Strength in Unity." Over the last two decades, we have transformed from a local support group into a prestigious community pillar.
                </p>

                <p className="text-slate-500 leading-relaxed text-lg">
                  Today, we provide a platform for professional networking, social support, and educational excellence. Our members are innovators, leaders, and contributors who believe in the power of collective progress.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-hover hover:border-blue-200 hover:bg-white hover:shadow-xl group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      <History size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mt-4">Heritage</h4>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-tight font-bold">Documenting our roots</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-hover hover:border-blue-200 hover:bg-white hover:shadow-xl group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      <Zap size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mt-4">Progress</h4>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-tight font-bold">Driving constant change</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle Glows */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-cyan-500/10 blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">The Pillars of Our <span className="text-blue-500">Excellence</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">The values that guide every decision, event, and initiative we undertake as a collective society.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
               <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Users size={32} />
               </div>
               <h3 className="text-2xl font-bold mb-4">Radical Inclusion</h3>
               <p className="text-slate-400 leading-relaxed">Opening our doors to diverse voices and ensuring every family member has a seat at the table of progress.</p>
            </div>

            <div className="group bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
               <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <Award size={32} />
               </div>
               <h3 className="text-2xl font-bold mb-4">Unwavering Integrity</h3>
               <p className="text-slate-400 leading-relaxed">Operating with transparency and honor in our donations, management, and community leadership.</p>
            </div>

            <div className="group bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
               <div className="w-16 h-16 bg-amber-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-amber-600/20 group-hover:scale-110 transition-transform">
                  <Heart size={32} />
               </div>
               <h3 className="text-2xl font-bold mb-4">Service First</h3>
               <p className="text-slate-400 leading-relaxed">Prioritizing the well-being and growth of our community through volunteerism and shared resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
           <div className="bg-blue-50 border border-blue-100 p-16 rounded-[4rem] relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-slate-900 mb-6">Ready to join our mission?</h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">Whether you are a new member or looking to contribute to our society&apos;s growth, your journey starts here.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link href="/members" className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                      Become a Member <ShieldCheck size={20} />
                   </Link>
                   <Link href="/donations" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                      Support Our Cause <Heart size={20} className="text-red-500" />
                   </Link>
                </div>
              </div>
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-[100px] -z-10 animate-pulse"></div>
           </div>
        </div>
      </section>

    </div>
  );
}
