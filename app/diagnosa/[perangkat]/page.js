'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Home, Laptop, Smartphone, Monitor, Battery, Tv, Cpu, Wrench, HelpCircle, AlertTriangle } from 'lucide-react';
import { gejalaLaptop } from '@/data/gejalaLaptop';
import { gejalaHP } from '@/data/gejalaHP';
import { gejalaPC } from '@/data/gejalaPC';

const deviceMapping = {
  laptop: { nama: 'Laptop', icon: Laptop, data: gejalaLaptop },
  hp: { nama: 'Handphone', icon: Smartphone, data: gejalaHP },
  pc: { nama: 'PC / Desktop', icon: Monitor, data: gejalaPC },
};

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('baterai') || name.includes('daya') || name.includes('boot')) {
    return Battery;
  }
  if (name.includes('layar') || name.includes('tampilan') || name.includes('sentuh')) {
    return Tv;
  }
  if (name.includes('performa') || name.includes('sistem')) {
    return Cpu;
  }
  if (name.includes('hardware') || name.includes('fisik') || name.includes('konektivitas')) {
    return Wrench;
  }
  return HelpCircle;
};

// Warna untuk header kategori
const colorClasses = [
  { border: 'border-red-600', text: 'text-red-700', bg: 'bg-red-50' },
  { border: 'border-blue-600', text: 'text-blue-700', bg: 'bg-blue-50' },
  { border: 'border-orange-600', text: 'text-orange-700', bg: 'bg-orange-50' },
  { border: 'border-green-600', text: 'text-green-700', bg: 'bg-green-50' }
];

export default function DiagnosaPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.perangkat;
  const isNew = searchParams?.get('new') === 'true';

  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGejala, setSelectedGejala] = useState({});
  const [gejalaTambahan, setGejalaTambahan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const MAX_GEJALA = 4;

  useEffect(() => {
    if (slug && deviceMapping[slug]) {
      // Jika parameter 'new=true' aktif, reset sesi diagnostik lama
      if (typeof window !== 'undefined' && isNew) {
        sessionStorage.removeItem('hasilDiagnosa');
        sessionStorage.removeItem('aletheia_diagnosa_hasil');
        sessionStorage.removeItem('aletheia_diagnosa_riwayat_id');
        sessionStorage.removeItem('aletheia_diagnosa_selected_ids');
        sessionStorage.removeItem('aletheia_diagnosa_device_name');
        sessionStorage.removeItem('aletheia_diagnosa_device_slug');
        sessionStorage.removeItem('aletheia_diagnosa_tambahan');
        sessionStorage.removeItem('pilihanSolusi');
        sessionStorage.removeItem('aletheia_diagnosa_solusi');
      }

      // Cek apakah ada hasil diagnosa aktif untuk perangkat ini di sessionStorage
      if (typeof window !== 'undefined' && !isNew) {
        const savedHasil = sessionStorage.getItem('hasilDiagnosa');
        if (savedHasil) {
          try {
            const parsed = JSON.parse(savedHasil);
            if (parsed.perangkat === slug) {
              const solution = sessionStorage.getItem('pilihanSolusi');
              if (solution === 'mandiri' || solution === 'servis') {
                router.replace(`/solusi/${solution}`);
              } else {
                router.replace('/hasil');
              }
              return; // Keluar awal untuk mencegah kedipan tampilan diagnosa
            }
          } catch (e) {
            console.error('Gagal membaca active hasilDiagnosa:', e);
          }
        }
      }

      setDeviceInfo(deviceMapping[slug]);

      // Load saved state dari localStorage jika ada
      if (typeof window !== 'undefined') {
        const savedGejala = localStorage.getItem(`aletheia_selected_gejala_${slug}`);
        const savedTambahan = localStorage.getItem(`aletheia_gejala_tambahan_${slug}`);
        if (savedGejala) {
          try {
            setSelectedGejala(JSON.parse(savedGejala));
          } catch (e) {
            console.error('Gagal parse saved gejala:', e);
          }
        }
        if (savedTambahan) {
          setGejalaTambahan(savedTambahan);
        }
      }
    }
    setLoading(false);
  }, [slug, router, isNew]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 text-neutral-900 animate-spin" />
        <span className="text-neutral-500 text-sm">Menyiapkan data diagnosa...</span>
      </div>
    );
  }

  if (!deviceInfo) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-neutral-900">Perangkat Tidak Ditemukan</h2>
        <p className="text-neutral-500 text-sm">Kategori perangkat &quot;{slug}&quot; belum didukung.</p>
        <Link href="/" className="inline-block px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-sm transition">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const { nama, icon: DeviceIcon, data } = deviceInfo;

  // Kelompokkan gejala berdasarkan kategori
  const groupedGejala = data.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = [];
    }
    acc[item.kategori].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedGejala);

  // Hitung start index untuk penomoran berlanjut antar kategori
  const categoryStartIndices = {};
  let currentStart = 0;
  categories.forEach((cat) => {
    categoryStartIndices[cat] = currentStart;
    currentStart += groupedGejala[cat].length;
  });

  // Toggle checkbox with max limit
  const handleCheckboxChange = (id) => {
    setSelectedGejala(prev => {
      const isCurrentlyChecked = !!prev[id];
      const currentCount = Object.values(prev).filter(Boolean).length;

      // Block new selection if already at max limit
      if (!isCurrentlyChecked && currentCount >= MAX_GEJALA) {
        setShowLimitWarning(true);
        setTimeout(() => setShowLimitWarning(false), 3000);
        return prev; // Don't update state
      }

      setShowLimitWarning(false);
      const updated = {
        ...prev,
        [id]: !prev[id]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`aletheia_selected_gejala_${slug}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Hitung jumlah gejala yang dipilih
  const selectedIds = Object.keys(selectedGejala).filter(id => selectedGejala[id]);
  const totalSelected = selectedIds.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalSelected === 0) return;

    setSubmitting(true);
    try {
      let userId = null;
      if (typeof window !== 'undefined') {
        userId = localStorage.getItem('aletheia_user_uuid');
      }

      const response = await fetch('/api/diagnosa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perangkat: slug,
          gejalaIds: selectedIds,
          gejalaTambahan: gejalaTambahan,
          userId: userId
        })
      });

      const resData = await response.json();
      if (resData.success) {
        // Simpan ke sessionStorage sesuai spesifikasi key 'hasilDiagnosa'
        const hasilObj = {
          perangkat: slug,
          gejalaIds: selectedIds,
          diagnosa: resData.hasil || resData.diagnosa || [],
          riwayatId: resData.riwayatId
        };
        sessionStorage.setItem('hasilDiagnosa', JSON.stringify(hasilObj));
        // Backwards compatibility keys
        sessionStorage.setItem('aletheia_diagnosa_hasil', JSON.stringify(resData.hasil));
        sessionStorage.setItem('aletheia_diagnosa_riwayat_id', resData.riwayatId);
        sessionStorage.setItem('aletheia_diagnosa_selected_ids', JSON.stringify(selectedIds));
        sessionStorage.setItem('aletheia_diagnosa_device_name', nama);
        sessionStorage.setItem('aletheia_diagnosa_device_slug', slug);
        sessionStorage.setItem('aletheia_diagnosa_tambahan', gejalaTambahan);

        // Clear saved state from localStorage upon successful submission
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`aletheia_selected_gejala_${slug}`);
          localStorage.removeItem(`aletheia_gejala_tambahan_${slug}`);
        }

        router.push('/hasil');
      } else {
        alert(resData.message || 'Gagal menganalisis gejala.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan saat diagnosa.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-neutral-950 flex items-center gap-2">
          <DeviceIcon className="h-6 w-6 text-neutral-900" /> Diagnosa {nama}
        </h1>
        <p className="text-sm text-neutral-500">Centang gejala yang sesuai <span className="font-bold text-neutral-700">(maks. {MAX_GEJALA} gejala)</span></p>
      </div>

      {/* Limit Warning Banner */}
      {showLimitWarning && (
        <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>Maksimal <strong>{MAX_GEJALA} gejala</strong> yang boleh dipilih. Hapus salah satu gejala terlebih dahulu untuk memilih yang lain.</span>
        </div>
      )}

      {/* Form Diagnosa */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Grid Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => {
            const gejalaList = groupedGejala[cat];
            const CatIcon = getCategoryIcon(cat);

            return (
              <div key={cat} className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                {/* Header Kategori */}
                <div className="border-b border-neutral-200 px-4 py-3 bg-neutral-50/70">
                  <h3 className="font-extrabold text-xs text-neutral-900 uppercase tracking-wide flex items-center gap-2 select-none">
                    <CatIcon className="h-4.5 w-4.5 text-neutral-500 shrink-0" />
                    {cat}
                  </h3>
                </div>

                <div className="p-4 space-y-3 flex-1">
                  {gejalaList.map((g, idx) => {
                    const isChecked = !!selectedGejala[g.id];
                    const globalIdx = (categoryStartIndices[cat] || 0) + idx;
                    return (
                      <label
                        key={g.id}
                        className={`flex items-start gap-3.5 p-1 rounded-lg text-xs leading-relaxed select-none group ${
                          !isChecked && totalSelected >= MAX_GEJALA
                            ? 'opacity-40 cursor-not-allowed'
                            : 'cursor-pointer text-neutral-700 hover:text-neutral-950'
                        }`}
                      >
                        <div className="relative shrink-0 mt-0.5 select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(g.id)}
                            className="sr-only"
                          />
                          <div className={`flex items-center justify-center h-6 w-6 rounded-md text-[10px] font-black transition-all duration-150 border ${
                            isChecked 
                              ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm scale-105' 
                              : 'bg-neutral-50 border-neutral-200 text-neutral-400 group-hover:border-neutral-400 group-hover:bg-neutral-100'
                          }`}>
                            {isChecked ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              globalIdx + 1
                            )}
                          </div>
                        </div>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-150 mt-1">
                          {g.deskripsi}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Lainnya di bawah semua kategori */}
        <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-sm space-y-2">
          <label htmlFor="lainnya" className="block text-xs font-bold text-neutral-900 uppercase tracking-wide">
            Gejala Lainnya (Opsional)
          </label>
          <textarea
            id="lainnya"
            rows={3}
            value={gejalaTambahan}
            onChange={(e) => {
              const val = e.target.value;
              setGejalaTambahan(val);
              if (typeof window !== 'undefined') {
                localStorage.setItem(`aletheia_gejala_tambahan_${slug}`, val);
              }
            }}
            placeholder="Tuliskan keluhan atau gejala lain jika ada..."
            className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 bg-neutral-50/50"
          />
        </div>

        {/* Sticky Summary & Button di Bawah */}
        <div className="fixed bottom-16 md:bottom-0 left-0 md:left-[var(--sidebar-width,240px)] right-0 border-t border-neutral-200 bg-white/95 backdrop-blur py-4 px-4 sm:px-6 md:px-12 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-end transition-[left] duration-300">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider hidden sm:block">Hasil Pemilihan</p>
              <p className="text-xs sm:text-sm font-black text-neutral-950">{totalSelected}/{MAX_GEJALA} Gejala<span className="hidden sm:inline"> dipilih</span></p>
            </div>
            <button
              type="submit"
              disabled={totalSelected === 0 || totalSelected > MAX_GEJALA || submitting}
              className={`
                px-4 sm:px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2
                ${totalSelected === 0
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-950 hover:bg-neutral-850 text-white shadow hover:shadow-md'
                }
              `}
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {submitting ? 'Menganalisis...' : 'Diagnosa Sekarang'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
