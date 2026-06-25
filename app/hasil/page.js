'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, ShieldAlert, BookOpen, AlertCircle, Wrench, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { gejalaLaptop } from '@/data/gejalaLaptop';
import { gejalaHP } from '@/data/gejalaHP';
import { gejalaPC } from '@/data/gejalaPC';

const deviceMapping = {
  laptop: { nama: 'Laptop', data: gejalaLaptop },
  hp: { nama: 'Handphone', data: gejalaHP },
  pc: { nama: 'PC / Desktop', data: gejalaPC },
};

export default function HasilPage() {
  const router = useRouter();
  const [hasil, setHasil] = useState(null);
  const [riwayatId, setRiwayatId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [deviceSlug, setDeviceSlug] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);

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
        setReferensi(data.referensi || []);
      } else {
        throw new Error(data.error || 'Gagal mengambil referensi.');
      }
    } catch (err) {
      console.error(err);
      setErrorReferensi('Gagal memuat daftar referensi pendukung.');
    } finally {
      setLoadingReferensi(false);
    }
  }, [hasil, deviceSlug, deviceName]);

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
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-semibold rounded-lg text-xs transition"
          >
            Mulai Diagnosa Ulang
          </Link>
        </div>
      </div>
    );
  }

  const primaryMatch = hasil[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Navigation header */}
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Beranda
        </Link>
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
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorExplain}</span>
              </div>
              <button
                onClick={fetchExplain}
                className="px-3 py-1.5 bg-white border border-neutral-250 hover:bg-neutral-50 text-neutral-950 font-semibold rounded text-[10px] transition cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="prose max-w-none text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
              {explainText}
            </div>
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
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorReferensi}</span>
              </div>
              <button
                onClick={fetchReferensi}
                className="px-3 py-1.5 bg-white border border-neutral-250 hover:bg-neutral-50 text-neutral-950 font-semibold rounded text-[10px] transition cursor-pointer"
              >
                Coba Lagi
              </button>
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
                    {ref.url && (
                      <a
                        href={ref.url.startsWith('http') ? ref.url : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-neutral-600 hover:text-neutral-950 hover:underline block break-all font-mono mt-0.5"
                      >
                        {ref.url}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

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
