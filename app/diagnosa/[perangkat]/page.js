'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Home, Laptop, Smartphone, Monitor } from 'lucide-react';
import { gejalaLaptop } from '@/data/gejalaLaptop';
import { gejalaHP } from '@/data/gejalaHP';
import { gejalaPC } from '@/data/gejalaPC';

const deviceMapping = {
  laptop: { nama: 'Laptop', icon: Laptop, data: gejalaLaptop },
  hp: { nama: 'Handphone', icon: Smartphone, data: gejalaHP },
  pc: { nama: 'PC / Desktop', icon: Monitor, data: gejalaPC },
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
  const slug = params?.perangkat;

  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGejala, setSelectedGejala] = useState({});
  const [gejalaTambahan, setGejalaTambahan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug && deviceMapping[slug]) {
      setDeviceInfo(deviceMapping[slug]);
    }
    setLoading(false);
  }, [slug]);

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

  // Toggle checkbox
  const handleCheckboxChange = (id) => {
    setSelectedGejala(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
        <p className="text-sm text-neutral-500">Centang semua gejala yang sesuai</p>
      </div>

      {/* Form Diagnosa */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Grid Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => {
            const color = colorClasses[idx % colorClasses.length];
            const gejalaList = groupedGejala[cat];

            return (
              <div key={cat} className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                {/* Header Kategori */}
                <div className={`border-b border-neutral-200 px-4 py-3 ${color.bg}`}>
                  <h3 className={`font-bold text-sm uppercase tracking-wide flex items-center gap-2 ${color.text}`}>
                    <span className={`w-2 h-2 rounded-full bg-current`} />
                    {cat}
                  </h3>
                </div>

                {/* Daftar Gejala */}
                <div className="p-4 space-y-3 flex-1">
                  {gejalaList.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed text-neutral-700 hover:text-neutral-950 select-none group"
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedGejala[g.id]}
                        onChange={() => handleCheckboxChange(g.id)}
                        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 focus:ring-offset-0 cursor-pointer accent-neutral-950"
                      />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                        {g.deskripsi}
                      </span>
                    </label>
                  ))}
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
            onChange={(e) => setGejalaTambahan(e.target.value)}
            placeholder="Tuliskan keluhan atau gejala lain jika ada..."
            className="w-full text-xs p-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 bg-neutral-50/50"
          />
        </div>

        {/* Sticky Summary & Button di Bawah */}
        <div className="fixed bottom-16 md:bottom-0 left-0 md:left-[240px] right-0 border-t border-neutral-200 bg-white/95 backdrop-blur py-4 px-4 sm:px-6 md:px-12 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center h-[42px] w-[42px] sm:w-auto sm:px-4 sm:gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950 transition-colors shadow-sm shrink-0"
            title="Kembali ke Beranda"
          >
            <Home className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:block text-xs font-bold">Home</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider hidden sm:block">Hasil Pemilihan</p>
              <p className="text-xs sm:text-sm font-black text-neutral-950">{totalSelected} Gejala<span className="hidden sm:inline"> dipilih</span></p>
            </div>
            <button
              type="submit"
              disabled={totalSelected === 0 || submitting}
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
