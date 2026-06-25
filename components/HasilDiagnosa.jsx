'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, ArrowRight, BookOpen, AlertCircle, Wrench } from 'lucide-react';

export default function HasilDiagnosa({ hasil, riwayatId, selectedGejalaIds }) {
  const [explanation, setExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState('');

  if (!hasil || hasil.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl text-amber-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Gejala Tidak Mencocokkan Kerusakan</h3>
        <p className="text-sm text-slate-400">
          Rule engine kami tidak mendeteksi kerusakan yang cocok dengan pola gejala yang Anda laporkan. Anda dapat berkonsultasi langsung ke spesialis servis.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href={`/api/ai/referensi`}
            onClick={(e) => {
              e.preventDefault();
              // redirection to manual lookup
            }}
            className="hidden px-5 py-2.5 bg-emerald-500 text-slate-900 font-semibold rounded-xl text-sm transition"
          >
            Cari Referensi AI
          </Link>
        </div>
      </div>
    );
  }

  const primaryMatch = hasil[0];
  const otherMatches = hasil.slice(1);

  const fetchAIExplanation = async () => {
    setLoadingAI(true);
    setErrorAI('');
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kerusakanId: primaryMatch.kerusakan.id,
          namaKerusakan: primaryMatch.kerusakan.nama,
          deskripsiKerusakan: primaryMatch.kerusakan.deskripsi,
          gejalaList: selectedGejalaIds,
          riwayatId: riwayatId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setExplanation(data.explanation);
      } else {
        throw new Error(data.error || 'Gagal mengambil penjelasan AI.');
      }
    } catch (err) {
      setErrorAI(err.message || 'Terjadi gangguan jaringan.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Primary Match Card */}
      <div className="relative overflow-hidden bg-slate-900 border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-950/5">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl"></div>

        {/* Card Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 tracking-wider font-extrabold uppercase">DIAGNOSA UTAMA</span>
              <h2 className="text-2xl font-black text-white mt-0.5">{primaryMatch.kerusakan.nama}</h2>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="text-xs text-slate-400 font-semibold">Certainty Factor (CF)</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-400">{(primaryMatch.certaintyFactor * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Masalah</h4>
            <p className="text-sm leading-relaxed text-slate-300 mt-2">{primaryMatch.kerusakan.deskripsi}</p>
          </div>

          {/* CF Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 font-semibold mb-2">
              <span>Akurasi Logika Sistem Pakar</span>
              <span>{(primaryMatch.certaintyFactor * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${primaryMatch.certaintyFactor * 100}%` }}
              ></div>
            </div>
          </div>

          {/* AI Explanation Action */}
          <div className="border-t border-slate-850 pt-6">
            {!explanation ? (
              <button
                onClick={fetchAIExplanation}
                disabled={loadingAI}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 text-emerald-400 border border-emerald-500/20 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer"
              >
                <Cpu className={`h-4 w-4 ${loadingAI ? 'animate-spin' : ''}`} />
                {loadingAI ? 'Agentic AI Menganalisis...' : 'Minta Penjelasan AI (Sebab-Akibat)'}
              </button>
            ) : (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-850 pb-2">
                  <Cpu className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Penjelasan AI (Gemini)</span>
                </div>
                <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line">
                  {explanation}
                </div>
              </div>
            )}

            {errorAI && (
              <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {errorAI}
              </p>
            )}
          </div>
        </div>

        {/* Solution Redirections */}
        <div className="mt-8 border-t border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/solusi/mandiri?kerusakanId=${primaryMatch.kerusakan.id}&nama=${encodeURIComponent(primaryMatch.kerusakan.nama)}&riwayatId=${riwayatId || ''}`}
            className="flex items-center justify-between p-4 bg-slate-950/40 hover:bg-emerald-950/20 border border-slate-800 hover:border-emerald-500/30 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-xl text-emerald-400 group-hover:bg-emerald-950 group-hover:text-emerald-300">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-500 group-hover:text-emerald-400 font-semibold block">Opsi Mandiri</span>
                <span className="text-sm font-bold text-white">Panduan Perbaiki Sendiri</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href={`/solusi/servis?kerusakanId=${primaryMatch.kerusakan.id}&nama=${encodeURIComponent(primaryMatch.kerusakan.nama)}&riwayatId=${riwayatId || ''}`}
            className="flex items-center justify-between p-4 bg-slate-950/40 hover:bg-cyan-950/20 border border-slate-800 hover:border-cyan-500/30 rounded-2xl transition group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-xl text-cyan-400 group-hover:bg-cyan-950 group-hover:text-cyan-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-500 group-hover:text-cyan-400 font-semibold block">Opsi Pusat Servis</span>
                <span className="text-sm font-bold text-white">Panduan Bawa ke Servis</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

      {/* Alternative Matched Damages */}
      {otherMatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Kemungkinan Kerusakan Lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherMatches.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{item.kerusakan.nama}</span>
                  <span className="text-sm font-extrabold text-cyan-400">{(item.certaintyFactor * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.kerusakan.deskripsi}</p>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/solusi/mandiri?kerusakanId=${item.kerusakan.id}&nama=${encodeURIComponent(item.kerusakan.nama)}&riwayatId=${riwayatId || ''}`}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    Lihat Panduan <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
