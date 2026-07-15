'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Search, ArrowLeft, Calendar, ShieldCheck, ClipboardList, AlertCircle, Laptop, Smartphone, Monitor, Home, ChevronDown, Lock, User, CheckCircle2, Wrench, XCircle, Download } from 'lucide-react';
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

const getSymptomGlobalNumber = (perangkatSlug, symptomId) => {
  let data = [];
  if (perangkatSlug === 'laptop') data = gejalaLaptop;
  else if (perangkatSlug === 'hp') data = gejalaHP;
  else if (perangkatSlug === 'pc') data = gejalaPC;
  else return 0;

  const grouped = data.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = [];
    }
    acc[item.kategori].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);
  let globalIndex = 1;
  
  for (const cat of categories) {
    const list = grouped[cat];
    for (const item of list) {
      if (item.id === symptomId) {
        return globalIndex;
      }
      globalIndex++;
    }
  }
  return 0;
};

export default function RiwayatPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('semua');
  const [activeDetail, setActiveDetail] = useState(null);

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // States untuk detail solusi mandiri di dalam riwayat
  const [mandiriData, setMandiriData] = useState(null);
  const [loadingMandiri, setLoadingMandiri] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [shakingStep, setShakingStep] = useState(null);

  useEffect(() => {
    if (activeDetail && activeDetail.solusiType === 'mandiri') {
      const loadMandiriDetails = async () => {
        setLoadingMandiri(true);
        try {
          const res = await fetch('/api/ai/mandiri', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              perangkat: activeDetail.perangkat?.slug,
              kerusakan: activeDetail.kerusakan?.nama,
              riwayatId: activeDetail.id
            })
          });
          const resData = await res.json();
          if (resData.success) {
            setMandiriData(resData.data);
          }
        } catch (e) {
          console.warn('Gagal memuat langkah perbaikan:', e);
        } finally {
          setLoadingMandiri(false);
        }
      };

      if (activeDetail.progressLangkah) {
        try {
          setCheckedSteps(JSON.parse(activeDetail.progressLangkah));
        } catch (e) {
          setCheckedSteps([]);
        }
      } else {
        setCheckedSteps([]);
      }

      loadMandiriDetails();
    } else {
      setMandiriData(null);
      setCheckedSteps([]);
    }
  }, [activeDetail?.id]);

  const handleToggleStep = async (stepNum) => {
    if (!activeDetail) return;
    const isCurrentlyChecked = checkedSteps.includes(stepNum);

    if (!isCurrentlyChecked) {
      // Men-centang: Hanya bisa jika langkah sebelumnya sudah tercentang
      if (stepNum > 1 && !checkedSteps.includes(stepNum - 1)) {
        setShakingStep(stepNum);
        setTimeout(() => setShakingStep(null), 400);
        return;
      }
    } else {
      // Melepas centang: Hanya bisa jika langkah setelahnya belum tercentang
      const hasCheckedAfter = checkedSteps.some(s => s > stepNum);
      if (hasCheckedAfter) {
        setShakingStep(stepNum);
        setTimeout(() => setShakingStep(null), 400);
        return;
      }
    }

    let newChecked;
    if (isCurrentlyChecked) {
      newChecked = checkedSteps.filter(s => s !== stepNum);
    } else {
      newChecked = [...checkedSteps, stepNum];
    }
    setCheckedSteps(newChecked);

    try {
      await fetch(`/api/riwayat/${activeDetail.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressLangkah: JSON.stringify(newChecked) })
      });

      // Sinkronkan state lokal agar item tetap terupdate
      setActiveDetail(prev => ({
        ...prev,
        progressLangkah: JSON.stringify(newChecked)
      }));

      setItems(prevItems => prevItems.map(item => {
        if (item.id === activeDetail.id) {
          return { ...item, progressLangkah: JSON.stringify(newChecked) };
        }
        return item;
      }));
    } catch (err) {
      console.error('Gagal memperbarui progress langkah di DB:', err);
    }
  };

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


  const handleExportToPDF = (item) => {
    const device = deviceMapping[item.perangkat?.slug];
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const symptomList = getSymptomTexts(item.gejalaIds);

    let solusiHTML = '';
    if (item.solusiType === 'mandiri' && mandiriData) {
      solusiHTML = `
        <div class="section">
          <h3>Panduan Perbaikan Mandiri (DIY)</h3>
          <table class="info-table">
            <tr>
              <td class="label">Tingkat Kesulitan</td>
              <td>${mandiriData.tingkatKesulitan || 'Menengah'}</td>
            </tr>
            <tr>
              <td class="label">Estimasi Waktu</td>
              <td>${mandiriData.estimasiWaktu || '30 - 60 menit'}</td>
            </tr>
            <tr>
              <td class="label">Estimasi Biaya Total</td>
              <td>Rp ${mandiriData.estimasiBiayaTotal?.min?.toLocaleString('id-ID')} - Rp ${mandiriData.estimasiBiayaTotal?.max?.toLocaleString('id-ID')}</td>
            </tr>
          </table>
          
          <h4>Alat yang Dibutuhkan:</h4>
          <ul>
            ${(mandiriData.alat || []).map(a => `<li><strong>${a.nama}</strong>: ${a.fungsi}</li>`).join('')}
          </ul>
          
          <h4>Bahan & Komponen:</h4>
          <ul>
            ${(mandiriData.bahan || []).map(b => `<li><strong>${b.nama}</strong> (Estimasi: ${b.estimasiHarga})</li>`).join('')}
          </ul>
          
          <h4>Langkah-Langkah Perbaikan:</h4>
          <ol>
            ${(mandiriData.langkah || []).map((step, idx) => {
              const stepNum = step.nomor || idx + 1;
              const isChecked = checkedSteps.includes(stepNum);
              return `<li>[${isChecked ? '✓' : ' '}] <strong>${step.judul}</strong> — <span style="color:#64748b;">${step.detail}</span></li>`;
            }).join('')}
          </ol>
        </div>
      `;
    } else if (item.hasilAI) {
      solusiHTML = `
        <div class="section">
          <h3>Panduan & Penjelasan AI</h3>
          <div style="font-size: 10pt; line-height: 1.6; text-align: justify; white-space: pre-wrap; color:#334155;">
            ${item.hasilAI.replace(/###/g, '<h4>').replace(/##/g, '<h3>').replace(/\n/g, '<br/>')}
          </div>
        </div>
      `;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up untuk mencetak laporan.');
      return;
    }

    printWindow.document.write(`
<html>
<head>
  <meta charset="utf-8">
  <title>Laporan_Diagnosa_${item.perangkat?.nama.replace(/\s+/g, '_')}_${item.id}</title>
  <style>
    @media print {
      body {
        margin: 1.6cm;
        -webkit-print-color-adjust: exact;
      }
      .no-print {
        display: none;
      }
    }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .header-block {
      border-bottom: 3px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand {
      font-size: 20pt;
      font-weight: 900;
      letter-spacing: -1px;
      color: #0f172a;
    }
    .title-doc {
      font-size: 10pt;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .info-table td {
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      font-size: 10pt;
    }
    .info-table td.label {
      font-weight: bold;
      background-color: #f8fafc;
      color: #475569;
      width: 30%;
    }
    .section {
      margin-bottom: 24px;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    h4 {
      font-size: 10pt;
      font-weight: bold;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
      font-size: 10pt;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 10px;
      padding-left: 20px;
      font-size: 10pt;
    }
    li {
      margin-bottom: 5px;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      margin-top: 40px;
      padding-top: 15px;
      font-size: 8.5pt;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header-block">
    <span class="brand">ALETHEIA</span>
    <span class="title-doc">Laporan Diagnosa Perangkat</span>
  </div>
  
  <table class="info-table">
    <tr>
      <td class="label">ID Diagnosa</td>
      <td>#AL-DG-${item.id}</td>
    </tr>
    <tr>
      <td class="label">Tanggal Diagnosa</td>
      <td>${dateFormatted}</td>
    </tr>
    <tr>
      <td class="label">Jenis Perangkat</td>
      <td>${item.perangkat?.nama}</td>
    </tr>
    <tr>
      <td class="label">Potensi Kerusakan</td>
      <td><strong>${item.kerusakan?.nama || 'Tidak terdeteksi'}</strong></td>
    </tr>
    <tr>
      <td class="label">Tingkat Keyakinan</td>
      <td>${item.certaintyFactor ? Math.round(item.certaintyFactor * 100) : 0}% (Certainty Factor: ${item.certaintyFactor || 0})</td>
    </tr>
    <tr>
      <td class="label">Status Perbaikan</td>
      <td>${item.status}</td>
    </tr>
  </table>

  <div class="section">
    <h3>Gejala yang Dilaporkan</h3>
    <ul>
      ${symptomList.map(s => `<li>${s}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h3>Deskripsi Kerusakan</h3>
    <p>${item.kerusakan?.deskripsi || 'Pattern tidak mencocokkan aturan pakar statis.'}</p>
  </div>

  ${solusiHTML}

  <div class="footer">
    Laporan ini dibuat otomatis oleh ALETHEIA (Sistem Pakar Diagnosa Perangkat Elektronik)
  </div>

  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 500);
    };
  </script>
</body>
</html>
    `);
    printWindow.document.close();
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Detail Riwayat Diagnosa</span>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-950 flex items-center gap-2">
              {device?.icon && <device.icon className="h-6 w-6 text-neutral-900" />} Diagnosa {item.perangkat?.nama}
            </h1>
            <p className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {dateFormatted}
            </p>
          </div>
          <button
            onClick={() => handleExportToPDF(item)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-xs tracking-wide shadow transition cursor-pointer shrink-0 self-start sm:self-center"
          >
            <Download className="h-4 w-4" />
            Cetak Laporan (PDF)
          </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {symptomList.map((g, idx) => {
                const foundGejala = allGejala.find(x => x.deskripsi === g);
                const globalNum = foundGejala ? getSymptomGlobalNumber(item.perangkat?.slug, foundGejala.id) : (idx + 1);
                return (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-150 bg-neutral-50/50 hover:bg-neutral-50 transition-all duration-200">
                    <span className="flex items-center justify-center h-6 w-6 rounded-md bg-neutral-950 border border-neutral-950 text-white font-black text-[10px] shrink-0 select-none shadow-sm mt-0.5">
                      {globalNum}
                    </span>
                    <span className="text-xs text-neutral-800 font-semibold leading-relaxed mt-0.5">
                      {g}
                    </span>
                  </div>
                );
              })}
            </div>

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

          {/* Jika Perbaiki Sendiri (Mandiri) - Tampilkan Panduan Interaktif dengan Checkbox */}
          {item.solusiType === 'mandiri' && (
            <div className="space-y-6">
              {loadingMandiri ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                  <div className="h-32 bg-neutral-100 rounded-xl"></div>
                </div>
              ) : mandiriData ? (
                <>
                  {/* Peringatan (jika ada) */}
                  {mandiriData.peringatan && mandiriData.peringatan.length > 0 && (
                    <div className="border border-red-200 bg-red-50 text-red-950 rounded-xl p-5 shadow-sm space-y-2">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <h4 className="font-extrabold text-xs uppercase tracking-wide">Peringatan Penting</h4>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {mandiriData.peringatan.map((warn, idx) => (
                          <li key={idx} className="text-xs text-red-900 leading-relaxed">{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Grid Kebutuhan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Alat */}
                    {mandiriData.alat && mandiriData.alat.length > 0 && (
                      <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3">
                        <h4 className="font-bold text-xs text-neutral-950 uppercase tracking-wide border-b border-neutral-100 pb-2">Alat yang Dibutuhkan</h4>
                        <ul className="space-y-2">
                          {mandiriData.alat.map((a, idx) => (
                            <li key={idx} className="text-xs text-neutral-700 leading-normal">
                              <span className="font-bold text-neutral-950">{a.nama}</span> — <span className="text-neutral-500">{a.fungsi}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Bahan */}
                    {mandiriData.bahan && mandiriData.bahan.length > 0 && (
                      <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3">
                        <h4 className="font-bold text-xs text-neutral-950 uppercase tracking-wide border-b border-neutral-100 pb-2">Bahan & Estimasi Harga</h4>
                        <ul className="space-y-2">
                          {mandiriData.bahan.map((b, idx) => (
                            <li key={idx} className="text-xs text-neutral-700 flex justify-between gap-2 leading-normal">
                              <span className="font-bold text-neutral-950">{b.nama}</span>
                              <span className="text-neutral-500 font-medium shrink-0">{b.estimasiHarga}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Langkah-langkah dengan Checkbox */}
                  <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide border-b border-neutral-100 pb-2">Progress Langkah Perbaikan</h3>
                    <div className="relative border-l border-neutral-100 ml-4 pl-6 space-y-6">
                      {mandiriData.langkah?.map((step, idx) => {
                        const stepNum = step.nomor || idx + 1;
                        const isChecked = checkedSteps.includes(stepNum);
                        return (
                          <div key={idx} className="relative">
                            <button
                              type="button"
                              onClick={() => handleToggleStep(stepNum)}
                              className={`absolute -left-10 top-0.5 rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black select-none border transition-all duration-200 cursor-pointer ${
                                shakingStep === stepNum
                                  ? 'animate-shake border-red-500 text-red-650 bg-red-50'
                                  : isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                  : 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-950 hover:bg-neutral-50'
                              }`}
                            >
                              {isChecked ? (
                                <svg className="h-4 w-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                stepNum
                              )}
                            </button>
                            <div className={`space-y-1 transition-all duration-300 ${isChecked ? 'opacity-40 line-through select-none' : ''}`}>
                              <h4 className="font-extrabold text-neutral-950 text-xs uppercase tracking-wider">{step.judul}</h4>
                              <p className="text-xs text-neutral-500 leading-relaxed">{step.detail}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <div className="text-center sm:text-left">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Estimasi Biaya</span>
                      <span className="text-xs font-extrabold text-neutral-950">
                        Rp {mandiriData.estimasiBiayaTotal?.min?.toLocaleString('id-ID')} - Rp {mandiriData.estimasiBiayaTotal?.max?.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-center sm:text-left border-y sm:border-y-0 sm:border-x border-neutral-200 py-2 sm:py-0 sm:px-4">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Estimasi Waktu</span>
                      <span className="text-xs font-extrabold text-neutral-950">{mandiriData.estimasiWaktu || '30 - 60 menit'}</span>
                    </div>
                    <div className="text-center sm:text-left sm:pl-4">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Tingkat Kesulitan</span>
                      <span className="text-xs font-extrabold text-neutral-950">{mandiriData.tingkatKesulitan || 'Menengah'}</span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Box Penjelasan AI / Panduan jika ada (Hanya jika bukan perbaikan mandiri) */}
          {item.solusiType !== 'mandiri' && item.hasilAI && !item.hasilAI.includes('Keluhan tambahan:') && (
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

      <div className="flex sm:justify-end shrink-0">
        <button
          onClick={() => onOpenDetail(item)}
          className="px-4 py-2 border border-neutral-200 hover:border-neutral-950 hover:bg-neutral-50 rounded-lg text-neutral-950 font-bold text-xs transition cursor-pointer whitespace-nowrap"
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
