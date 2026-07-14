'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Search, ArrowLeft, Calendar, ShieldCheck, ClipboardList, AlertCircle, Laptop, Smartphone, Monitor, Home, ChevronDown, Lock, User, CheckCircle2, Wrench, XCircle } from 'lucide-react';
import { gejalaLaptop } from '@/data/gejalaLaptop';
import { gejalaHP } from '@/data/gejalaHP';
import { gejalaPC } from '@/data/gejalaPC';

const deviceMapping = {
  laptop: { nama: 'Laptop', icon: Laptop },
  hp: { nama: 'Handphone', icon: Smartphone },
  pc: { nama: 'PC / Desktop', icon: Monitor },
};

// Menggabungkan semua gejala untuk pencarian deskripsi dari ID
const allGejala = [...gejalaLaptop, ...gejalaHP, ...gejalaPC];

export default function RiwayatPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('semua');
  const [activeDetail, setActiveDetail] = useState(null);

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (data.success && data.isLoggedIn) {
        setIsLoggedIn(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('aletheia_logged_in', 'true');
          localStorage.setItem('aletheia_logged_in_user', data.user.username);
          localStorage.setItem('aletheia_user_uuid', data.user.username);
        }
        await fetchRiwayat();
      } else {
        setIsLoggedIn(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('aletheia_logged_in');
          localStorage.removeItem('aletheia_logged_in_user');
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Session check error:', err);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const fetchRiwayat = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/riwayat');
      const data = await response.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        throw new Error(data.error || 'Gagal memuat riwayat.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data riwayat dari database.');
    } finally {
      setLoading(false);
    }
  };

  // Helper mapping status
  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === 'berhasil' || s === 'success' || s === 'done') {
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 inline-block mr-1 align-text-top" />;
    }
    if (s === 'proses' || s === 'process' || s === 'pending') {
      return <Wrench className="h-3.5 w-3.5 text-neutral-900 inline-block mr-1 align-text-top animate-pulse" />;
    }
    return <XCircle className="h-3.5 w-3.5 text-rose-600 inline-block mr-1 align-text-top" />;
  };

  const getSymptomTexts = (gejalaIdsJson) => {
    try {
      const ids = JSON.parse(gejalaIdsJson || '[]');
      return ids.map(id => {
        const found = allGejala.find(g => g.id === id);
        return found ? found.deskripsi : id;
      });
    } catch (e) {
      return [];
    }
  };

  // Filter & Search Logic
  const filteredItems = items.filter(item => {
    // 1. Filter by Perangkat
    if (deviceFilter !== 'semua' && item.perangkat?.slug !== deviceFilter) {
      return false;
    }

    // 2. Filter by Search Query (Nama Kerusakan atau Gejala)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const namaKerusakan = item.kerusakan?.nama?.toLowerCase() || 'tidak terdeteksi';
      const symptoms = getSymptomTexts(item.gejalaIds).join(' ').toLowerCase();
      return namaKerusakan.includes(query) || symptoms.includes(query);
    }

    return true;
  });

  // Grouping Logic (Hari ini, Minggu lalu, Lebih lama)
  const groupItems = (itemsToGroup) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const oneWeekAgo = todayStart - 7 * 24 * 60 * 60 * 1000;

    const grouped = {
      hariIni: [],
      mingguLalu: [],
      lebihLama: []
    };

    itemsToGroup.forEach(item => {
      const createdTime = new Date(item.createdAt).getTime();
      if (createdTime >= todayStart) {
        grouped.hariIni.push(item);
      } else if (createdTime >= oneWeekAgo) {
        grouped.mingguLalu.push(item);
      } else {
        grouped.lebihLama.push(item);
      }
    });

    return grouped;
  };

  const grouped = groupItems(filteredItems);

  if (loading) {
    return (
      <div className="space-y-8 pb-24">
        {/* Header Skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-4 bg-neutral-100 rounded w-1/2"></div>
        </div>

        {/* Search & Filter Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between animate-pulse">
          <div className="h-10 bg-neutral-200 rounded-lg flex-1"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-neutral-200 rounded-lg w-16"></div>
            ))}
          </div>
        </div>

        {/* Listing Groups Skeletons */}
        <div className="space-y-6">
          <div className="h-4 bg-neutral-200 rounded w-16 animate-pulse"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-neutral-200 bg-white rounded-xl p-5 shadow-sm animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-12 w-12 bg-neutral-200 rounded-lg shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-neutral-200 rounded w-1/3"></div>
                  <div className="h-3 bg-neutral-150/70 rounded w-3/4"></div>
                  <div className="h-2.5 bg-neutral-100 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-8 bg-neutral-200 rounded-lg w-24 shrink-0"></div>
            </div>
          ))}
        </div>

      </div>
    );
  }


  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-900 border border-neutral-200 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-neutral-950">Riwayat Diagnosa Terkunci</h2>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              Anda belum masuk ke sistem. Silakan masuk terlebih dahulu untuk dapat melihat catatan riwayat diagnosa perangkat Anda.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-xs tracking-wide shadow-sm transition select-none"
          >
            Masuk Sekarang
          </Link>
        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-neutral-950 flex items-center gap-2">
            <ClipboardList className="h-6.5 w-6.5" /> Riwayat Diagnosa
          </h1>
          <p className="text-sm text-neutral-500">Log riwayat pemeriksaan perangkat elektronik yang pernah dilakukan</p>
        </div>

        <div className="border border-red-200 bg-red-50 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wide">Terjadi Kesalahan</h4>
              <p className="text-xs text-red-700 leading-relaxed mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchRiwayat}
            className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-xs tracking-wide shadow transition cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>

      </div>
    );
  }


  // JIKA TAMPILAN DETAIL AKTIF (REPLACE VIEW)
  if (activeDetail) {
    const item = activeDetail;
    const device = deviceMapping[item.perangkat?.slug];
    const DeviceIcon = device?.icon || Laptop;
    const symptomList = getSymptomTexts(item.gejalaIds);
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div className="space-y-8 pb-24">
        {/* Back Button */}
        <div>
          <button
            onClick={() => setActiveDetail(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Riwayat
          </button>
        </div>

        {/* Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Detail Riwayat Diagnosa</span>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-950 flex items-center gap-2">
            {device?.icon && <device.icon className="h-6 w-6 text-neutral-900" />} Diagnosa {item.perangkat?.nama}
          </h1>
          <p className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {dateFormatted}
          </p>
        </div>

        <div className="space-y-6">
          {/* Box Kerusakan */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Kerusakan Terdeteksi</span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200">
                Status: {getStatusIcon(item.status)} {item.status}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-950">{item.kerusakan?.nama || 'Tidak terdeteksi'}</h2>
              <p className="text-xs text-neutral-500 leading-relaxed mt-1">{item.kerusakan?.deskripsi || 'Symptom pattern did not match any static expert rules.'}</p>
            </div>
          </div>

          {/* Box Gejala */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Gejala yang Dilaporkan</h3>
            <ul className="list-disc pl-5 space-y-2">
              {symptomList.map((g, idx) => (
                <li key={idx} className="text-xs text-neutral-700 leading-relaxed">{g}</li>
              ))}
            </ul>

            {/* Keluhan tambahan (jika ada) */}
            {item.hasilAI && item.hasilAI.includes('Keluhan tambahan:') && (
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Catatan Tambahan</span>
                <p className="text-xs italic text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-150">
                  {item.hasilAI.replace('Keluhan tambahan:', '').trim()}
                </p>
              </div>
            )}
          </div>

          {/* Opsi Solusi yang Dipilih */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-2">
            <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Pilihan Solusi</h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Solusi yang dipilih oleh pengguna: {' '}
              <span className="font-bold text-neutral-950 capitalize">
                {item.solusiType ? (item.solusiType === 'servis' ? 'Bawa ke Servis' : 'Perbaiki Sendiri') : 'Belum menentukan pilihan'}
              </span>
            </p>
          </div>

          {/* Box Penjelasan AI / Panduan jika ada */}
          {item.hasilAI && !item.hasilAI.includes('Keluhan tambahan:') && (
            <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Dokumentasi Panduan AI</h3>
              <DropdownAIExplanation text={item.hasilAI} />
            </div>
          )}
        </div>

      </div>
    );
  }


  // TAMPILAN UTAMA LIST RIWAYAT
  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-neutral-950 flex items-center gap-2">
          <ClipboardList className="h-6.5 w-6.5" /> Riwayat Diagnosa
        </h1>
        <p className="text-sm text-neutral-500">Log riwayat pemeriksaan perangkat elektronik yang pernah dilakukan</p>
      </div>
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari diagnosa atau gejala..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 bg-white"
          />
        </div>

        {/* Filter Dropdown / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['semua', 'laptop', 'hp', 'pc'].map((slug) => (
            <button
              key={slug}
              onClick={() => setDeviceFilter(slug)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold capitalize tracking-wide shrink-0 transition cursor-pointer border
                ${deviceFilter === slug
                  ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border-neutral-200'
                }
              `}
            >
              {slug === 'hp' ? 'Handphone' : slug === 'pc' ? 'PC' : slug}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Groups */}
      <div className="space-y-8">
        {filteredItems.length === 0 ? (
          <div className="border border-neutral-200 bg-white rounded-xl p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <ClipboardList className="h-8 w-8 text-neutral-400 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-950">Riwayat Kosong</h3>
            <p className="text-xs text-neutral-500">
              Tidak ada data riwayat diagnosa yang sesuai dengan filter pencarian Anda.
            </p>
          </div>
        ) : (
          <>
            {/* Hari ini */}
            {grouped.hariIni.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Hari Ini</h3>
                <div className="space-y-3">
                  {grouped.hariIni.map(item => (
                    <RiwayatItemCard key={item.id} item={item} onOpenDetail={setActiveDetail} />
                  ))}
                </div>
              </div>
            )}

            {/* Minggu lalu */}
            {grouped.mingguLalu.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Minggu Lalu</h3>
                <div className="space-y-3">
                  {grouped.mingguLalu.map(item => (
                    <RiwayatItemCard key={item.id} item={item} onOpenDetail={setActiveDetail} />
                  ))}
                </div>
              </div>
            )}

            {/* Lebih lama */}
            {grouped.lebihLama.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Lebih Lama</h3>
                <div className="space-y-3">
                  {grouped.lebihLama.map(item => (
                    <RiwayatItemCard key={item.id} item={item} onOpenDetail={setActiveDetail} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}


// Subcomponent: RiwayatItemCard
function RiwayatItemCard({ item, onOpenDetail }) {
  const device = deviceMapping[item.perangkat?.slug];
  const dateObj = new Date(item.createdAt);
  const timeFormatted = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  // Get short symptom representation
  const symptoms = getSymptomTexts(item.gejalaIds);
  const symptomSummary = symptoms.length > 2
    ? `${symptoms.slice(0, 2).join(', ')}...`
    : symptoms.join(', ');

  function getSymptomTexts(gejalaIdsJson) {
    try {
      const ids = JSON.parse(gejalaIdsJson || '[]');
      return ids.map(id => {
        const found = allGejala.find(g => g.id === id);
        return found ? found.deskripsi : id;
      });
    } catch (e) {
      return [];
    }
  }

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === 'berhasil' || s === 'success' || s === 'done') {
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 inline-block align-middle" />;
    }
    if (s === 'proses' || s === 'process' || s === 'pending') {
      return <Wrench className="h-3.5 w-3.5 text-neutral-900 inline-block align-middle animate-pulse" />;
    }
    return <XCircle className="h-3.5 w-3.5 text-rose-600 inline-block align-middle" />;
  };

  return (
    <div className="border border-neutral-200 hover:border-neutral-900 bg-white rounded-xl p-5 shadow-sm hover:shadow transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Device Icon Block */}
        <div className="p-3 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-100 flex-shrink-0">
          {device?.icon ? <device.icon className="h-5 w-5 text-neutral-900" /> : <Laptop className="h-5 w-5 text-neutral-900" />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-neutral-950 uppercase tracking-wide">
              {item.kerusakan?.nama || 'Kerusakan Tidak Terdeteksi'}
            </span>
            <span className="text-xs select-none" title={`Status: ${item.status}`}>
              {getStatusIcon(item.status)}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-normal">
            <span className="font-bold text-neutral-700">Gejala:</span> {symptomSummary || 'Tidak ada gejala terpilih.'}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-medium">
            <span>{dateFormatted}, {timeFormatted}</span>
            <span>•</span>
            <span className="capitalize">
              Solusi: {item.solusiType ? (item.solusiType === 'servis' ? 'Servis' : 'Mandiri') : 'Belum memilih'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex sm:justify-end">
        <button
          onClick={() => onOpenDetail(item)}
          className="px-4 py-2 border border-neutral-200 hover:border-neutral-950 hover:bg-neutral-50 rounded-lg text-neutral-950 font-bold text-xs transition cursor-pointer"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}

function parseAIExplanation(text) {
  if (!text) return [];
  
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const parsed = [];
  let currentTitle = "";
  
  const defaultTitles = [
    "Analisis Kerusakan",
    "Mekanisme & Dampak Teknis",
    "Rekomendasi Tindakan"
  ];
  
  blocks.forEach((block) => {
    const headerMatch = block.match(/^(?:###|##|\*\*|#)\s*(.*?)(?:\*\*|:)?\n([\s\S]*)$/m) 
                     || block.match(/^(?:###|##|\*\*|#)\s*(.*)$/);
                     
    if (headerMatch) {
      const title = headerMatch[1].replace(/[\*\#\:]/g, '').trim();
      const content = headerMatch[2] ? headerMatch[2].trim() : "";
      
      if (content) {
        parsed.push({ title, content });
      } else {
        currentTitle = title;
      }
    } else {
      const title = currentTitle || defaultTitles[parsed.length] || `Detail Analisis ${parsed.length + 1}`;
      parsed.push({ title, content: block });
      currentTitle = "";
    }
  });
  
  return parsed;
}

function DropdownAIExplanation({ text }) {
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const parsedBlocks = parseAIExplanation(text);

  if (parsedBlocks.length === 0) return null;

  return (
    <div className="space-y-3">
      {parsedBlocks.map((block, idx) => {
        const isOpen = !!openSections[idx];
        return (
          <div key={idx} className="border border-neutral-200 bg-white rounded-xl overflow-hidden transition-all duration-200 shadow-sm">
            <button
              onClick={() => toggleSection(idx)}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-neutral-900 bg-neutral-50/50 hover:bg-neutral-100/70 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-black">{idx + 1}</span>
                {block.title}
              </span>
              <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="p-4 prose max-w-none text-xs text-neutral-700 leading-relaxed whitespace-pre-line bg-white border-t border-neutral-100">
                {block.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
