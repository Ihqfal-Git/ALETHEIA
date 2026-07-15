'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, ShieldAlert, BookOpen, AlertCircle, Wrench, ArrowRight, CheckCircle2, XCircle, ChevronDown, Settings, Search } from 'lucide-react';
import { gejalaLaptop, gejalaHP, gejalaPC } from '@/data/gejala';

const deviceMapping = {
  laptop: { nama: 'Laptop', data: gejalaLaptop },
  hp: { nama: 'Handphone', data: gejalaHP },
  pc: { nama: 'PC / Desktop', data: gejalaPC },
};

const getSymptomGlobalNumber = (perangkatSlug, symptomId) => {
  const device = deviceMapping[perangkatSlug];
  if (!device) return 0;

  const grouped = device.data.reduce((acc, item) => {
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

export default function HasilPage() {
  const router = useRouter();
  const [hasil, setHasil] = useState(null);
  const [riwayatId, setRiwayatId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [deviceSlug, setDeviceSlug] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);

  const handleNewDiagnosis = () => {
    if (typeof window !== 'undefined') {
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
    router.push(`/diagnosa/${deviceSlug || 'hp'}`);
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
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
  };

  // States untuk API AI Explain
  const [explainText, setExplainText] = useState('');
  const [loadingExplain, setLoadingExplain] = useState(true);
  const [errorExplain, setErrorExplain] = useState('');

  // States untuk API AI Referensi
  const [referensi, setReferensi] = useState([]);
  const [loadingReferensi, setLoadingReferensi] = useState(true);
  const [errorReferensi, setErrorReferensi] = useState('');

  // States untuk Status Riwayat
  const [status, setStatus] = useState('proses');
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Load session storage data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pilihanSolusi');
      sessionStorage.removeItem('aletheia_diagnosa_solusi');
    }

    const savedHasilDiagnosa = sessionStorage.getItem('hasilDiagnosa');

    if (savedHasilDiagnosa) {
      try {
        const parsed = JSON.parse(savedHasilDiagnosa);
        setHasil(parsed.diagnosa || []);
        setRiwayatId(parsed.riwayatId);
        setSelectedIds(parsed.gejalaIds || []);
        setDeviceSlug(parsed.perangkat || '');
        if (parsed.perangkat && deviceMapping[parsed.perangkat]) {
          setDeviceName(deviceMapping[parsed.perangkat].nama);
        }
      } catch (err) {
        console.error('Gagal parse hasilDiagnosa dari sessionStorage', err);
      }
    } else {
      // Legacy fallback
      const savedHasil = sessionStorage.getItem('aletheia_diagnosa_hasil');
      const savedRiwayatId = sessionStorage.getItem('aletheia_diagnosa_riwayat_id');
      const savedSelectedIds = sessionStorage.getItem('aletheia_diagnosa_selected_ids');
      const savedDeviceName = sessionStorage.getItem('aletheia_diagnosa_device_name');
      const savedDeviceSlug = sessionStorage.getItem('aletheia_diagnosa_device_slug');

      if (savedHasil) setHasil(JSON.parse(savedHasil));
      if (savedRiwayatId) setRiwayatId(savedRiwayatId);
      if (savedSelectedIds) setSelectedIds(JSON.parse(savedSelectedIds));
      if (savedDeviceName) setDeviceName(savedDeviceName);
      if (savedDeviceSlug) setDeviceSlug(savedDeviceSlug);
    }
    setLoadingSession(false);
  }, []);

  // Fetch AI Explain
  const fetchExplain = useCallback(async () => {
    if (!hasil || hasil.length === 0) return;
    const primaryMatch = hasil[0];
    const targetSlug = deviceSlug || 'laptop';

    setLoadingExplain(true);
    setErrorExplain('');
    try {
      const symptomsList = deviceMapping[targetSlug]?.data || [];
      const gejalaCocokDeskripsi = primaryMatch.gejalaCocok.map(id => {
        const match = symptomsList.find(g => g.id === id);
        return match ? match.deskripsi : id;
      });

      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perangkat: targetSlug,
          kerusakan: primaryMatch.kerusakan.nama,
          deskripsi: primaryMatch.kerusakan.deskripsi,
          gejalaCocok: gejalaCocokDeskripsi,
          riwayatId: riwayatId
        })
      });

      const data = await response.json();
      if (data.success) {
        setExplainText(data.penjelasan || data.explanation);
      } else {
        throw new Error(data.error || 'Gagal mengambil penjelasan AI.');
      }
    } catch (err) {
      console.error(err);
      setErrorExplain('Gagal memuat penjelasan sebab-akibat dari Gemini AI.');
    } finally {
      setLoadingExplain(false);
    }
  }, [hasil, deviceSlug, riwayatId]);

  // Fetch AI Referensi
  const fetchReferensi = useCallback(async () => {
    if (!hasil || hasil.length === 0) return;
    const primaryMatch = hasil[0];
    const targetSlug = deviceSlug || 'laptop';

    setLoadingReferensi(true);
    setErrorReferensi('');
    try {
      const response = await fetch('/api/ai/referensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kerusakanId: `K-${primaryMatch.ruleId}`,
          kerusakan: primaryMatch.kerusakan.nama,
          perangkat: deviceName || targetSlug
        })
      });

      const data = await response.json();
      if (data.success) {
        let refs = data.referensi || [];
        
        // 1. BIOS Beep Code / POST issues (Intel)
        const hasBiosSymptom = selectedIds.includes('P03') || selectedIds.includes('P04');
        const isRamOrMotherboardRule = primaryMatch.ruleId === 'P002' || primaryMatch.ruleId === 'P005';
        if (hasBiosSymptom || isRamOrMotherboardRule) {
          if (!refs.some(r => r.url && r.url.includes('intel.co.id'))) {
            refs = [
              {
                judul: 'Mengidentifikasi Kode Beep BIOS Komputer',
                penulis: 'Intel Corporation',
                tahun: 2024,
                url: 'https://www.intel.co.id/content/www/id/id/search.html#q=Mengidentifikasi%20Kode%20Beep%20BIOS%20Komputer',
                relevansi: 'Panduan pencarian dan penyelesaian masalah kode bunyi beep motherboard Intel'
              },
              ...refs
            ];
          }
        }

        // 2. Windows BSOD / OS Corrupt (Microsoft)
        const isWindowsCorrupt = primaryMatch.ruleId === 'P007' || selectedIds.includes('P11') || selectedIds.includes('P14');
        if (isWindowsCorrupt) {
          if (!refs.some(r => r.url && r.url.includes('support.microsoft.com'))) {
            refs = [
              {
                judul: 'Menyelesaikan Kesalahan Layar Biru (BSOD) di Windows',
                penulis: 'Microsoft Support',
                tahun: 2024,
                url: 'https://support.microsoft.com/id-id/windows/menyelesaikan-kesalahan-layar-biru-di-windows-60b01860-58f2-be66-7516-5c45a66ae3c6',
                relevansi: 'Panduan resmi penyelesaian masalah layar biru dan kegagalan booting Windows'
              },
              ...refs
            ];
          }
        }

        // 3. Laptop Battery / Power issues (HP Support)
        const isBatteryLaptop = primaryMatch.ruleId === 'L002' || selectedIds.includes('L02') || selectedIds.includes('L03');
        if (isBatteryLaptop) {
          if (!refs.some(r => r.url && r.url.includes('support.hp.com'))) {
            refs = [
              {
                judul: 'Pengujian dan Kalibrasi Baterai Laptop HP',
                penulis: 'HP Customer Support',
                tahun: 2024,
                url: 'https://support.hp.com/id-id/document/ish_4465457-4347714-16',
                relevansi: 'Panduan resmi kalibrasi dan cek kesehatan baterai laptop'
              },
              ...refs
            ];
          }
        }

        // 4. Smartphone Battery Swelling / Care (Samsung Support)
        const isBatteryPhone = primaryMatch.ruleId === 'H001' || selectedIds.includes('H02') || selectedIds.includes('H04');
        if (isBatteryPhone) {
          if (!refs.some(r => r.url && r.url.includes('samsung.com/id'))) {
            refs = [
              {
                judul: 'Tips Perawatan dan Pengisian Daya Baterai Handphone',
                penulis: 'Samsung Indonesia Support',
                tahun: 2024,
                url: 'https://www.samsung.com/id/support/mobile-devices/battery-tips/',
                relevansi: 'Tips resmi menjaga kesehatan baterai lithium ponsel dari degradasi'
              },
              ...refs
            ];
          }
        }

        // 5. Storage / HDD / SSD bad blocks (Kingston Support)
        const isStorageIssue = primaryMatch.ruleId === 'P004' || primaryMatch.ruleId === 'L007' || selectedIds.includes('P12') || selectedIds.includes('L13');
        if (isStorageIssue) {
          if (!refs.some(r => r.url && r.url.includes('kingston.com'))) {
            refs = [
              {
                judul: 'Memonitor Kesehatan Solid State Drive (SSD) via SSD Manager',
                penulis: 'Kingston Technology',
                tahun: 2024,
                url: 'https://www.kingston.com/en/support/technical/ssdmanager',
                relevansi: 'Utilitas resmi diagnosa bad block, update firmware, dan kesehatan media penyimpanan'
              },
              ...refs
            ];
          }
        }
        // Hanya tampilkan referensi yang memiliki URL eksternal (website asli)
        const validRefs = refs.filter(r => r.url && r.url.startsWith('http'));
        setReferensi(validRefs);
      } else {
        throw new Error(data.error || 'Gagal mengambil referensi.');
      }
    } catch (err) {
      console.error(err);
      setErrorReferensi('Gagal memuat daftar referensi pendukung.');
    } finally {
      setLoadingReferensi(false);
    }
  }, [hasil, deviceSlug, deviceName, selectedIds]);

  // Auto trigger fetches once variables are ready
  useEffect(() => {
    if (loadingSession || !hasil || hasil.length === 0) return;
    fetchExplain();
    fetchReferensi();

    // Ambil status awal riwayat jika ada
    if (riwayatId) {
      const fetchInitialStatus = async () => {
        try {
          const res = await fetch(`/api/riwayat/${riwayatId}`);
          const data = await res.json();
          if (data.success && data.data) {
            setStatus(data.data.status || 'proses');
          }
        } catch (e) {
          console.warn('Gagal memuat status awal riwayat:', e);
        }
      };
      fetchInitialStatus();
    }
  }, [loadingSession, hasil, riwayatId, fetchExplain, fetchReferensi]);

  // Handle pilihan solusi & database update
  const handleSelectSolution = async (solusiType) => {
    sessionStorage.setItem('pilihanSolusi', solusiType);
    sessionStorage.setItem('aletheia_diagnosa_solusi', solusiType);

    // Update solusiType di database jika riwayatId tersedia
    if (riwayatId) {
      try {
        await fetch(`/api/riwayat/${riwayatId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ solusiType: solusiType })
        });
      } catch (err) {
        console.error('Gagal menyimpan solusiType ke DB:', err);
      }
    }

    router.push(`/solusi/${solusiType}`);
  };

  // Handle update status riwayat (Berhasil / Gagal)
  const handleUpdateStatus = async (newStatus) => {
    if (!riwayatId) return;
    setStatusSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch(`/api/riwayat/${riwayatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const resData = await response.json();
      if (resData.success) {
        setStatus(newStatus);
        setStatusMessage(`Status berhasil diperbarui menjadi: ${newStatus === 'berhasil' ? 'Berhasil' : 'Gagal'}`);
      } else {
        throw new Error(resData.error || 'Gagal memperbarui status.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Gagal mengubah status di server.');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleSelectAlternative = (index) => {
    if (!hasil || index <= 0 || index >= hasil.length) return;
    const newHasil = [...hasil];
    const temp = newHasil[0];
    newHasil[0] = newHasil[index];
    newHasil[index] = temp;
    setHasil(newHasil);

    // Update sessionStorage agar halaman solusi/mandiri dan solusi/servis menggunakan primaryMatch baru
    const savedHasilDiagnosa = sessionStorage.getItem('hasilDiagnosa');
    if (savedHasilDiagnosa) {
      try {
        const parsed = JSON.parse(savedHasilDiagnosa);
        parsed.diagnosa = newHasil;
        sessionStorage.setItem('hasilDiagnosa', JSON.stringify(parsed));
      } catch (e) {
        console.error('Gagal memperbarui hasilDiagnosa di sessionStorage', e);
      }
    }
  };

  if (loadingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 text-neutral-900 animate-spin" />
        <span className="text-neutral-500 text-sm">Memuat hasil diagnosa...</span>
      </div>
    );
  }

  if (!hasil || hasil.length === 0) {
    return (
      <div className="border border-neutral-200 bg-white rounded-2xl p-8 text-center max-w-md mx-auto space-y-4 shadow-sm">
        <div className="inline-flex items-center justify-center p-4 bg-red-50 border border-red-100 rounded-full text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">Gejala Tidak Cocok</h3>
        <p className="text-xs leading-relaxed text-neutral-500">
          Sistem pakar kami tidak mendeteksi kerusakan yang memiliki kecocokan tinggi dengan gejala yang Anda pilih. Silakan lakukan diagnosa ulang dengan gejala yang lebih detail.
        </p>
        <div className="pt-2">
          <button
            onClick={handleNewDiagnosis}
            className="inline-block px-5 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Mulai Diagnosa Ulang
          </button>
        </div>
      </div>
    );
  }

  const primaryMatch = hasil[0];
  const symptomsList = deviceMapping[deviceSlug]?.data || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Navigation header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <Link href="/" onClick={handleGoHome} className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Beranda
        </Link>
        <button
          onClick={handleNewDiagnosis}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 hover:bg-neutral-850 text-white rounded-lg text-[10px] font-bold shadow transition cursor-pointer select-none"
        >
          <span>Diagnosa Baru</span>
        </button>
      </div>

      {/* Main Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-neutral-950">
          Hasil Analisis Kerusakan
        </h1>
        <p className="text-sm text-neutral-500">
          Analisis kecocokan gejala untuk {deviceName}
        </p>
      </div>

      <div className="space-y-6">
        {/* Box Merah: Nama Kerusakan + Persentase Keyakinan */}
        <div className="border border-red-200 bg-red-50/60 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block">Potensi Kerusakan</span>
            <h2 className="text-xl md:text-2xl font-black text-red-950">{primaryMatch.kerusakan.nama}</h2>
            <p className="text-xs text-red-800/80 leading-relaxed max-w-xl">{primaryMatch.kerusakan.deskripsi}</p>
          </div>
          <div className="flex flex-col items-start md:items-end shrink-0">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Keyakinan (CF)</span>
            <span className="text-3xl md:text-4xl font-black text-red-600">{primaryMatch.persentase}%</span>
          </div>
        </div>

        {/* Box Gejala yang Dicentang */}
        <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60">
            <CheckCircle2 className="h-4.5 w-4.5 text-neutral-850" />
            <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Gejala yang Anda Pilih</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {selectedIds.map((id) => {
              const match = symptomsList.find(g => g.id === id);
              const globalNum = getSymptomGlobalNumber(deviceSlug, id);
              return (
                <div key={id} className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-150 bg-neutral-50/50 hover:bg-neutral-50 transition-all duration-200">
                  <span className="flex items-center justify-center h-6 w-6 rounded-md bg-neutral-950 border border-neutral-950 text-white font-black text-[10px] shrink-0 select-none shadow-sm mt-0.5">
                    {globalNum || '?'}
                  </span>
                  <span className="text-xs text-neutral-800 font-semibold leading-relaxed mt-0.5">
                    {match ? match.deskripsi : id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box Abu: Penjelasan AI (Dengan Skeleton & Error Handling) */}
        <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60">
            <Wrench className="h-4.5 w-4.5 text-neutral-800" />
            <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Penjelasan AI (Sebab-Akibat)</h3>
          </div>

          {loadingExplain ? (
            /* Skeleton loader pulse */
            <div className="animate-pulse space-y-2.5 py-2">
              <div className="h-3.5 bg-neutral-200 rounded w-11/12"></div>
              <div className="h-3.5 bg-neutral-200 rounded w-full"></div>
              <div className="h-3.5 bg-neutral-200 rounded w-4/5"></div>
              <div className="h-3.5 bg-neutral-200 rounded w-10/12"></div>
            </div>
          ) : errorExplain ? (
            /* Error state with retry */
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-2 text-red-650 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorExplain}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchExplain}
                  className="px-3 py-1.5 bg-white border border-neutral-250 hover:bg-neutral-50 text-neutral-950 font-semibold rounded text-[10px] transition cursor-pointer"
                >
                  Coba Lagi
                </button>
                <Link
                  href="/pengaturan"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-955 hover:bg-neutral-855 text-white font-semibold rounded text-[10px] transition cursor-pointer"
                >
                  <Settings className="h-3 w-3" />
                  Atur API Key
                </Link>
              </div>
            </div>
          ) : (
            <DropdownAIExplanation text={explainText} />
          )}
        </div>

        {/* Box Referensi (Dengan Skeleton & Error Handling) */}
        <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60">
            <BookOpen className="h-4.5 w-4.5 text-neutral-800" />
            <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Referensi Pendukung</h3>
          </div>

          {loadingReferensi ? (
            /* Skeleton list loader pulse */
            <div className="animate-pulse space-y-3.5 py-2">
              <div className="space-y-1.5">
                <div className="h-3.5 bg-neutral-200 rounded w-2/3"></div>
                <div className="h-3 bg-neutral-100 rounded w-1/3"></div>
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-3 bg-neutral-100 rounded w-1/4"></div>
              </div>
            </div>
          ) : errorReferensi ? (
            /* Error state with retry */
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-2 text-red-655 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorReferensi}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchReferensi}
                  className="px-3 py-1.5 bg-white border border-neutral-250 hover:bg-neutral-50 text-neutral-950 font-semibold rounded text-[10px] transition cursor-pointer"
                >
                  Coba Lagi
                </button>
                <Link
                  href="/pengaturan"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-955 hover:bg-neutral-855 text-white font-semibold rounded text-[10px] transition cursor-pointer"
                >
                  <Settings className="h-3 w-3" />
                  Atur API Key
                </Link>
              </div>
            </div>
          ) : referensi.length === 0 ? (
            <p className="text-xs text-neutral-400">Tidak ada referensi tambahan untuk kerusakan ini.</p>
          ) : (
            <ul className="space-y-3.5 pl-0">
              {referensi.map((ref, idx) => (
                <li key={idx} className="list-none text-xs flex items-start gap-2 text-neutral-700">
                  <span className="font-bold text-neutral-950 select-none">[{idx + 1}]</span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-neutral-900">{ref.judul}</p>
                    <p className="text-[11px] text-neutral-500">
                      {ref.penulis && `${ref.penulis}. `}
                      {ref.tahun && `(${ref.tahun}).`}
                    </p>
                    {ref.relevansi && (
                      <p className="text-[10px] text-neutral-400 font-medium">Relevansi: {ref.relevansi}</p>
                    )}
                    {ref.url && ref.url.startsWith('http') ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-neutral-600 hover:text-neutral-950 hover:underline block break-all font-mono mt-0.5"
                      >
                        {ref.url}
                      </a>
                    ) : (
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(ref.judul + ' ' + (ref.penulis || ''))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-950 hover:underline mt-1 font-bold bg-neutral-100/60 hover:bg-neutral-100 px-2 py-0.5 rounded transition-all duration-200"
                      >
                        <Search className="h-2.5 w-2.5 shrink-0" />
                        <span>Cari Referensi ini di Google</span>
                      </a>
                    )}
                    {ref.url && !ref.url.startsWith('http') && (
                      <span className="text-[9px] text-neutral-400 block mt-0.5 font-medium">
                        Sumber: {ref.url}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Kemungkinan Kerusakan Lainnya */}
        {hasil.length > 1 && (
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60">
              <ShieldAlert className="h-4.5 w-4.5 text-neutral-850" />
              <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Kemungkinan Kerusakan Lainnya</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasil.slice(1).map((item, idx) => {
                const originalIndex = idx + 1;
                return (
                  <div key={item.kerusakan.id || idx} className="border border-neutral-200 hover:border-neutral-400 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between gap-3 bg-neutral-50/30">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-neutral-950">{item.kerusakan.nama}</span>
                        <span className="text-xs font-black text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">{item.persentase}%</span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{item.kerusakan.deskripsi}</p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSelectAlternative(originalIndex)}
                        className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-[10px] tracking-wide transition cursor-pointer"
                      >
                        Analisis Kerusakan Ini
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2 Tombol Besar Opsi Solusi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => handleSelectSolution('servis')}
            className="flex items-center justify-between p-6 border border-neutral-250 bg-white hover:bg-neutral-50/70 hover:border-neutral-950 rounded-xl transition-all duration-300 text-left group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Bawa ke Teknisi</span>
                <span className="text-sm font-extrabold text-neutral-950">Bawa ke Servis</span>
                <span className="text-xs text-neutral-500 block leading-relaxed">Estimasi biaya, sparepart, dan tips teknisi.</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-1.5 transition-all duration-300" />
          </button>

          <button
            onClick={() => handleSelectSolution('mandiri')}
            className="flex items-center justify-between p-6 border border-neutral-255 bg-white hover:bg-neutral-50/70 hover:border-neutral-950 rounded-xl transition-all duration-300 text-left group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
                <Wrench className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Lakukan Sendiri</span>
                <span className="text-sm font-extrabold text-neutral-950">Perbaiki Sendiri</span>
                <span className="text-xs text-neutral-500 block leading-relaxed">Panduan alat, bahan, langkah, & tingkat kesulitan.</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-1.5 transition-all duration-300" />
          </button>
        </div>

        {/* Update Status Riwayat (Berhasil / Gagal) */}
        {riwayatId && (
          <div className="flex flex-col items-center justify-center pt-8 border-t border-neutral-150 gap-4">
            <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-widest text-center">
              Apakah hasil diagnosa ini membantu menyelesaikan masalah Anda?
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleUpdateStatus('berhasil')}
                disabled={statusSubmitting}
                className={`
                  flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer select-none
                  ${status === 'berhasil'
                    ? 'border-green-600 bg-green-650 text-green-700 bg-green-50'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                  }
                `}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Tandai Berhasil</span>
              </button>
              <button
                onClick={() => handleUpdateStatus('gagal')}
                disabled={statusSubmitting}
                className={`
                  flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer select-none
                  ${status === 'gagal'
                    ? 'border-red-600 bg-red-650 text-red-700 bg-red-50'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                  }
                `}
              >
                <XCircle className="h-4 w-4" />
                <span>Tandai Gagal</span>
              </button>
            </div>
            {statusMessage && (
              <p className="text-[10px] text-neutral-500 font-semibold mt-1">
                {statusMessage}
              </p>
            )}
          </div>
        )}
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
