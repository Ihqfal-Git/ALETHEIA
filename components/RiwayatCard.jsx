'use client';

import React, { useState } from 'react';
import { Laptop, Smartphone, Monitor, Calendar, Clock, ChevronDown, ChevronUp, AlertCircle, Wrench, ShieldCheck, Cpu } from 'lucide-react';

const iconMap = {
  Laptop: Laptop,
  Smartphone: Smartphone,
  Monitor: Monitor,
};

export default function RiwayatCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const IconComponent = iconMap[item.perangkat?.icon] || Laptop;

  // Format date
  const dateFormatted = new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timeFormatted = new Date(item.createdAt).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let gejalaArr = [];
  try {
    gejalaArr = JSON.parse(item.gejalaIds);
  } catch (e) {
    gejalaArr = [];
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden transition-all duration-300 hover:border-slate-700">
      {/* Summary Header */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-850/40 transition"
      >
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 border border-slate-700/50 p-3 rounded-2xl text-emerald-400">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">{item.perangkat?.nama}</span>
              <span className={`
                text-[9px] font-bold px-2 py-0.5 rounded-full border
                ${item.status === 'berhasil' 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-900/50' 
                  : 'bg-rose-950 text-rose-400 border-rose-900/50'
                }
              `}>
                {item.status === 'berhasil' ? 'Terdiagnosa' : 'Gagal'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              {item.kerusakan ? item.kerusakan.nama : 'Kerusakan tidak teridentifikasi'}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {dateFormatted}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {timeFormatted}</span>
            </div>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="bg-slate-950/40 border-t border-slate-850 p-5 md:p-6 space-y-6">
          {/* Selected Symptoms */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gejala Terlapor</h4>
            <div className="flex flex-wrap gap-2">
              {gejalaArr.length > 0 ? (
                gejalaArr.map((gId, idx) => (
                  <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-750 font-medium">
                    {gId}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">Tidak ada detail kode gejala.</span>
              )}
            </div>
          </div>

          {/* Diagnosis conclusion & AI summary logs */}
          {item.kerusakan && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mekanisme Kerusakan</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.kerusakan.deskripsi}</p>
              </div>

              {item.solusiType && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Pilihan Penanganan: {item.solusiType === 'servis' ? 'Pusat Servis' : 'Perbaikan Mandiri (DIY)'}</span>
                </div>
              )}

              {item.hasilAI && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Cpu className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Hasil Analisis AI Tersimpan</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line prose prose-invert prose-xs max-w-none">
                    {item.hasilAI}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
