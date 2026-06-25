import React from 'react';
import Link from 'next/link';

export const revalidate = 0;

export default function Home() {
  const devices = [
    { name: 'Laptop', slug: 'laptop', emoji: '💻', desc: 'Analisis masalah baterai, performa, keyboard, atau layar laptop Anda.' },
    { name: 'Handphone', slug: 'hp', emoji: '📱', desc: 'Identifikasi gangguan layar sentuh, pengisian daya, atau sinyal HP.' },
    { name: 'PC / Desktop', slug: 'pc', emoji: '🖥️', desc: 'Deteksi kerusakan PSU, RAM, kegagalan booting, atau kartu grafis PC.' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 py-12 text-center bg-white">
      <div className="max-w-2xl mx-auto space-y-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-neutral-950 tracking-tight">
          Perangkat elektronikmu bermasalah?
        </h1>
        <p className="text-neutral-500 text-sm md:text-base font-medium">
          Pilih perangkat, centang gejala, dapat solusi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {devices.map((device) => (
          <Link
            key={device.slug}
            href={`/diagnosa/${device.slug}`}
            className="group block border border-neutral-200 hover:border-neutral-950 rounded-2xl p-6 md:p-8 bg-white hover:bg-neutral-50 transition-all duration-300 text-left flex flex-col justify-between h-56 shadow-sm hover:shadow-md"
          >
            <div className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110">
              {device.emoji}
            </div>
            <div className="space-y-1.5 mt-8">
              <h3 className="font-extrabold text-lg text-neutral-950">
                {device.name}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {device.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
