import React from 'react';
import Link from 'next/link';
import { Laptop, Smartphone, Monitor, ChevronRight } from 'lucide-react';

const iconMap = {
  Laptop: Laptop,
  Smartphone: Smartphone,
  Monitor: Monitor,
};

export default function CardPerangkat({ perangkat }) {
  const IconComponent = iconMap[perangkat.icon] || Laptop;

  return (
    <Link href={`/diagnosa/${perangkat.slug}`} className="group block">
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between h-72">
        {/* Glow effect on hover */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-emerald-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 rounded-full bg-cyan-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300"></div>

        {/* Card Content */}
        <div>
          <div className="inline-flex items-center justify-center p-4 bg-slate-800 border border-slate-700/50 rounded-2xl text-emerald-400 group-hover:text-emerald-300 group-hover:bg-emerald-950/30 group-hover:border-emerald-500/20 transition-all duration-300 mb-6">
            <IconComponent className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-200">
            {perangkat.nama}
          </h3>
          <p className="text-sm text-slate-400 mt-2 line-clamp-2">
            Mulai diagnosa kerusakan {perangkat.nama.toLowerCase()} Anda menggunakan rule engine forward chaining dan kecerdasan AI.
          </p>
        </div>

        {/* Action Link Row */}
        <div className="flex items-center justify-between mt-6 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
          <span>Mulai Diagnosa</span>
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-800 border border-slate-700/50 group-hover:bg-emerald-500 group-hover:text-slate-900 group-hover:border-transparent transition-all duration-300">
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}
