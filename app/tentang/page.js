'use client';

import React from 'react';
import Link from 'next/link';
import { Info, Cpu, Smartphone, Laptop, Monitor, Layers, Settings, BookOpen, Home } from 'lucide-react';

export default function TentangPage() {
  const supportedDevices = [
    { name: 'Laptop', icon: Laptop, desc: 'Mendiagnosa kelistrikan baterai, tampilan layar bergaris/mati, keyboard malafungsi, dan overheating.' },
    { name: 'Handphone', icon: Smartphone, desc: 'Mendiagnosa LCD blank, layar sentuh ghost touch, baterai kembung/drop, dan gangguan penerimaan sinyal.' },
    { name: 'PC / Desktop', icon: Monitor, desc: 'Mendiagnosa power supply mati total, kipas berputar bising, beep code bios, dan kegagalan boot RAM.' },
  ];

  const techStack = [
    { category: 'Frontend & Framework', items: ['Next.js 14 (App Router)', 'React 18', 'Tailwind CSS'] },
    { category: 'Database & ORM', items: ['MySQL', 'Prisma ORM'] },
    { category: 'Artificial Intelligence', items: ['Google Gemini 2.0 Flash API', 'Generative AI Integration'] },
    { category: 'Metode Sistem Pakar', items: ['Inference Engine: Forward Chaining', 'Ketidakpastian: Certainty Factor (CF)'] }
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Informasi Sistem</span>
        <h1 className="text-2xl md:text-3xl font-black text-neutral-950 flex items-center gap-2">
          <Info className="h-6.5 w-6.5 text-neutral-900" /> Tentang ALETHEIA
        </h1>
        <p className="text-sm text-neutral-500">
          Mengenal arsitektur sistem pakar diagnosa kerusakan elektronik
        </p>
      </div>

      {/* Deskripsi Singkat */}
      <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider">Deskripsi Singkat</h2>
        <p className="text-xs text-neutral-600 leading-relaxed font-sans">
          ALETHEIA (Sistem Pakar Diagnosa Kerusakan Elektronik) adalah platform cerdas yang dirancang untuk mengidentifikasi jenis kerusakan pada laptop, handphone, dan desktop PC. Dengan memasukkan gejala-gejala fisik yang dirasakan pada perangkat, sistem dapat secara otomatis menyimpulkan potensi kerusakan komponen dan memberikan rekomendasi solusi perbaikan yang relevan.
        </p>
      </div>

      {/* Cara Kerja Sistem */}
      <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider">Cara Kerja Sistem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sistem Pakar */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-900">
              <Settings className="h-4.5 w-4.5" />
              <h3 className="font-bold text-xs uppercase tracking-wide">1. Logika Sistem Pakar (Rule Engine)</h3>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Sistem mencocokkan gejala yang Anda pilih dengan basis aturan (*rule base*) menggunakan penalaran maju (**Forward Chaining**). Tingkat keyakinan hasil diagnosis kemudian dihitung secara matematis menggunakan nilai **Certainty Factor (CF)** berdasarkan proporsi gejala yang cocok dengan bobot keyakinan dari pakar.
            </p>
          </div>

          {/* Agentic AI */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-900">
              <Cpu className="h-4.5 w-4.5" />
              <h3 className="font-bold text-xs uppercase tracking-wide">2. Analisis Lanjutan Agentic AI</h3>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Setelah sistem pakar menyimpulkan jenis kerusakan, **Google Gemini AI** diintegrasikan untuk memberikan penjelasan sebab-akibat yang interaktif, merangkum referensi ilmiah terkait, menyusun panduan perbaikan mandiri (DIY) secara real-time, atau merinci estimasi biaya dan kelengkapan saat membawa ke pusat servis.
            </p>
          </div>
        </div>
      </div>

      {/* Perangkat yang Didukung */}
      <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider">Perangkat yang Didukung</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportedDevices.map((device, idx) => (
            <div key={idx} className="border border-neutral-100 bg-neutral-50/50 rounded-lg p-4 space-y-2">
              <div className="p-2 bg-neutral-100 rounded-lg inline-flex">
                <device.icon className="h-5 w-5 text-neutral-900" />
              </div>
              <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wide">{device.name}</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">{device.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stack Teknologi */}
      <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider">Stack Teknologi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-bold text-[10px] text-neutral-450 uppercase tracking-widest border-b border-neutral-100 pb-1">
                {tech.category}
              </h3>
              <ul className="space-y-1.5">
                {tech.items.map((item, idy) => (
                  <li key={idy} className="text-xs text-neutral-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neutral-950 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Home Button Footer */}
      <div className="fixed bottom-16 md:bottom-0 left-0 md:left-[240px] right-0 border-t border-neutral-200 bg-white/95 backdrop-blur py-4 px-4 sm:px-6 md:px-12 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center h-[42px] w-[42px] sm:w-auto sm:px-4 sm:gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950 transition-colors shadow-sm shrink-0"
          title="Kembali ke Beranda"
        >
          <Home className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:block text-xs font-bold">Home</span>
        </Link>
      </div>
    </div>
  );
}
