import React from 'react';
import Link from 'next/link';
import { Laptop, Smartphone, Monitor, ArrowRight, Cpu, ShieldCheck, Zap } from 'lucide-react';

export const revalidate = 0;

export default function Home() {
  const devices = [
    { 
      name: 'Laptop', 
      slug: 'laptop', 
      icon: Laptop, 
      desc: 'Analisis masalah baterai, performa, keyboard, atau layar laptop Anda.',
      color: 'group-hover:text-blue-600',
      bgGlow: 'group-hover:shadow-blue-500/10'
    },
    { 
      name: 'Handphone', 
      slug: 'hp', 
      icon: Smartphone, 
      desc: 'Identifikasi gangguan layar sentuh, pengisian daya, atau sinyal HP.',
      color: 'group-hover:text-emerald-600',
      bgGlow: 'group-hover:shadow-emerald-500/10'
    },
    { 
      name: 'PC / Desktop', 
      slug: 'pc', 
      icon: Monitor, 
      desc: 'Deteksi kerusakan PSU, RAM, kegagalan booting, atau kartu grafis PC.',
      color: 'group-hover:text-violet-600',
      bgGlow: 'group-hover:shadow-violet-500/10'
    },
  ];

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-16 overflow-hidden bg-white">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neutral-100 rounded-full blur-[120px] opacity-70 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neutral-50 rounded-full blur-[140px] opacity-60 -z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="max-w-3xl mx-auto space-y-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 shadow-sm animate-fade-in select-none">
          <Cpu className="h-3.5 w-3.5 text-neutral-900" />
          <span className="text-[10px] font-extrabold text-neutral-850 uppercase tracking-widest">
            Agentic AI & Expert System
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-700 tracking-tight leading-[1.1] max-w-2xl mx-auto">
          Perangkat Elektronik Bermasalah?
        </h1>
        
        <p className="text-neutral-505 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
          Deteksi kerusakan instan dan dapatkan solusi akurat berbasis aturan pakar serta analisis cerdas Gemini AI.
        </p>
      </div>

      {/* Device Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4 mb-20">
        {devices.map((device) => (
          <Link
            key={device.slug}
            href={`/diagnosa/${device.slug}?new=true`}
            className={`group relative border border-neutral-250 hover:border-neutral-950 rounded-2xl p-7 bg-white/70 backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-between h-64 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1.5 text-center overflow-hidden ${device.bgGlow}`}
          >
            {/* Top Icon Block */}
            <div className="p-3.5 bg-neutral-50 group-hover:bg-neutral-950 rounded-xl transition-colors duration-300 inline-flex shadow-sm">
              <device.icon className={`h-8 w-8 text-neutral-900 group-hover:text-white transition-colors duration-300 ${device.color}`} />
            </div>
            
            {/* Middle Descriptions */}
            <div className="space-y-2 flex-1 mt-6">
              <h3 className="font-black text-lg text-neutral-950">
                {device.name}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed px-2">
                {device.desc}
              </p>
            </div>

            {/* Hover Action Indicator */}
            <div className="mt-4 flex items-center gap-1 text-[11px] font-extrabold text-neutral-400 group-hover:text-neutral-950 transition-colors duration-300 uppercase tracking-widest">
              <span>Mulai Diagnosa</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-4xl border-t border-neutral-200/80 pt-10 px-4 grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-50 border border-neutral-200/50 mb-1">
            <ShieldCheck className="h-4 w-4 text-neutral-900" />
          </div>
          <p className="text-xl md:text-2xl font-black text-neutral-950">100%</p>
          <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Akurasi Gejala</p>
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-50 border border-neutral-200/50 mb-1">
            <Zap className="h-4 w-4 text-neutral-900" />
          </div>
          <p className="text-xl md:text-2xl font-black text-neutral-950">64+</p>
          <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Gejala Tercover</p>
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-50 border border-neutral-200/50 mb-1">
            <Cpu className="h-4 w-4 text-neutral-900" />
          </div>
          <p className="text-xl md:text-2xl font-black text-neutral-950">Gemini AI</p>
          <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Analisis Penjelasan</p>
        </div>
      </div>
    </div>
  );
}
