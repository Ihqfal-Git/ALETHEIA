'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Cpu, ShieldAlert, CheckCircle, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';

export default function PanduanServis({ kerusakanId, namaKerusakan, riwayatId }) {
  const [guide, setGuide] = useState('');
  const [references, setReferences] = useState([]);
  const [loadingGuide, setLoadingGuide] = useState(true);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await fetch('/api/ai/servis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kerusakanId, namaKerusakan, riwayatId }),
        });
        const data = await res.json();
        if (data.success) {
          setGuide(data.guide);
        } else {
          throw new Error(data.error || 'Gagal membuat panduan.');
        }
      } catch (err) {
        setError('Gagal memuat panduan servis AI: ' + err.message);
      } finally {
        setLoadingGuide(false);
      }
    };

    const fetchReferences = async () => {
      try {
        const res = await fetch('/api/ai/referensi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kerusakanId, namaKerusakan }),
        });
        const data = await res.json();
        if (data.success) {
          setReferences(data.referensi);
        }
      } catch (err) {
        console.error('Gagal memuat referensi:', err);
      } finally {
        setLoadingRefs(false);
      }
    };

    if (kerusakanId && namaKerusakan) {
      fetchGuide();
      fetchReferences();
    }
  }, [kerusakanId, namaKerusakan, riwayatId]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-3 py-1 rounded-full border border-cyan-800 font-extrabold tracking-wider uppercase">PANDUAN PUSAT SERVIS</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <span className="text-xs text-slate-400 font-medium">Diagnosa Terpilih</span>
          <h2 className="text-2xl font-black text-white mt-1">{namaKerusakan}</h2>
        </div>

        {/* AI Guide Content */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center gap-2 text-cyan-400 mb-4">
            <Cpu className="h-5 w-5" />
            <h3 className="text-lg font-bold text-white">Rekomendasi Persiapan Servis AI</h3>
          </div>

          {loadingGuide ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
              <span className="text-sm text-slate-400 font-medium">Agen AI sedang merumuskan panduan servis...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-950/20 border border-rose-900/30 text-rose-400 rounded-2xl text-sm flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed text-sm space-y-4">
              {guide}
            </div>
          )}
        </div>

        {/* External References Section */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <BookOpen className="h-5 w-5" />
            <h3 className="text-lg font-bold text-white">Referensi Dokumentasi & Manual</h3>
          </div>

          {loadingRefs ? (
            <div className="flex items-center gap-2 py-4 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
              <span>Memuat referensi rujukan...</span>
            </div>
          ) : references.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between p-4 bg-slate-950/30 hover:bg-emerald-950/10 border border-slate-800 hover:border-emerald-500/30 rounded-2xl transition group"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <span className={`
                      text-[9px] font-bold px-2 py-0.5 rounded-full border
                      ${ref.sumber === 'ai'
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }
                    `}>
                      {ref.sumber === 'ai' ? 'Rekomendasi AI' : 'Referensi Statis'}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {ref.judul}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Oleh {ref.penulis || 'Anonim'} {ref.tahun ? `(${ref.tahun})` : ''}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition flex-shrink-0 mt-1" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Tidak ada referensi manual eksternal yang tersedia.</p>
          )}
        </div>

        {/* Brand Checklist Guarantee Banner */}
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-cyan-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Sudah melakukan backup data penting?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Selalu prioritaskan keselamatan data Anda sebelum melepas unit utama ke tangan pihak ketiga.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition"
          >
            Selesai & Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
