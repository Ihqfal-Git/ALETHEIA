'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Landmark, Wrench, ShieldAlert, Clock, AlertCircle } from 'lucide-react';

export default function SolusiServisPage() {
  const router = useRouter();
  const [deviceSlug, setDeviceSlug] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [riwayatId, setRiwayatId] = useState(null);
  const [kerusakanNama, setKerusakanNama] = useState('');
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

  // States untuk API AI
  const [servisData, setServisData] = useState(null);
  const [loadingAPI, setLoadingAPI] = useState(true);
  const [errorAPI, setErrorAPI] = useState('');

  // Fungsi fetch data dari API
  const fetchServisInfo = async (slugVal, kerusakanVal, riwayatVal) => {
    setLoadingAPI(true);
    setErrorAPI('');
    try {
      const response = await fetch('/api/ai/servis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perangkat: slugVal || 'laptop',
          kerusakan: kerusakanVal,
          riwayatId: riwayatVal
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setServisData(resData.data);
      } else {
        throw new Error(resData.error || 'Gagal memuat panduan servis AI.');
      }
    } catch (err) {
      console.error(err);
      setErrorAPI('Gagal mengambil detail estimasi servis dari server.');
    } finally {
      setLoadingAPI(false);
    }
  };

  useEffect(() => {
    // Ambil data dari sessionStorage key 'hasilDiagnosa'
    const savedHasilDiagnosa = sessionStorage.getItem('hasilDiagnosa');
    let targetSlug = '';
    let targetName = '';
    let targetRiwayatId = null;
    let targetKerusakan = '';

    if (savedHasilDiagnosa) {
      try {
        const parsed = JSON.parse(savedHasilDiagnosa);
        targetSlug = parsed.perangkat || '';
        targetRiwayatId = parsed.riwayatId;
        
        if (parsed.diagnosa && parsed.diagnosa.length > 0) {
          targetKerusakan = parsed.diagnosa[0].kerusakan.nama;
        }
        
        setDeviceSlug(targetSlug);
        setRiwayatId(targetRiwayatId);
        setKerusakanNama(targetKerusakan);
      } catch (err) {
        console.error('Gagal parse hasilDiagnosa di solusi/servis', err);
      }
    } else {
      // Legacy fallback
      const savedHasil = sessionStorage.getItem('aletheia_diagnosa_hasil');
      const savedRiwayatId = sessionStorage.getItem('aletheia_diagnosa_riwayat_id');
      const savedDeviceName = sessionStorage.getItem('aletheia_diagnosa_device_name');
      const savedDeviceSlug = sessionStorage.getItem('aletheia_diagnosa_device_slug');

      if (savedHasil) {
        const hasilArr = JSON.parse(savedHasil);
        if (hasilArr.length > 0) {
          targetKerusakan = hasilArr[0].kerusakan.nama;
          setKerusakanNama(targetKerusakan);
        }
      }
      if (savedDeviceSlug) {
        targetSlug = savedDeviceSlug;
        setDeviceSlug(targetSlug);
      }
      if (savedDeviceName) {
        targetName = savedDeviceName;
        setDeviceName(targetName);
      }
      if (savedRiwayatId) {
        targetRiwayatId = savedRiwayatId;
        setRiwayatId(targetRiwayatId);
      }
    }

    setLoadingSession(false);

    if (targetKerusakan) {
      fetchServisInfo(targetSlug, targetKerusakan, targetRiwayatId);
    } else {
      setLoadingAPI(false);
    }
  }, []);

  const handleRetry = () => {
    if (kerusakanNama) {
      fetchServisInfo(deviceSlug, kerusakanNama, riwayatId);
    }
  };

  if (loadingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 text-neutral-900 animate-spin" />
        <span className="text-neutral-500 text-sm">Memuat sesi perbaikan...</span>
      </div>
    );
  }

  if (!kerusakanNama) {
    return (
      <div className="border border-neutral-200 bg-white rounded-2xl p-8 text-center max-w-md mx-auto space-y-4 shadow-sm">
        <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-full text-neutral-900">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">Data Tidak Ditemukan</h3>
        <p className="text-xs leading-relaxed text-neutral-500">
          Sesi diagnosis tidak ditemukan. Silakan lakukan diagnosis baru.
        </p>
        <div className="pt-2">
          <button
            onClick={handleNewDiagnosis}
            className="inline-block px-5 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Mulai Diagnosa Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Navigation header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <Link href="/hasil" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Hasil Diagnosa
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
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Panduan Bawa ke Pusat Servis</span>
        <h1 className="text-2xl md:text-3xl font-black text-neutral-950">
          Opsi Servis: {kerusakanNama}
        </h1>
        <p className="text-sm text-neutral-500">
          Estimasi dan saran penanganan oleh teknisi profesional
        </p>
      </div>

      {loadingAPI ? (
        /* SKELETON LOADER DENGAN PULSE DI SELURUH BOX */
        <div className="space-y-6">
          {/* Skeleton Estimasi Biaya */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
            <div className="h-3 bg-neutral-100 rounded w-3/4"></div>
          </div>

          {/* Skeleton Estimasi Waktu */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-5 bg-neutral-200 rounded w-1/3"></div>
          </div>

          {/* Skeleton Komponen Diperiksa */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-neutral-200 rounded w-11/12"></div>
              <div className="h-3 bg-neutral-200 rounded w-4/5"></div>
              <div className="h-3 bg-neutral-200 rounded w-10/12"></div>
            </div>
          </div>
        </div>
      ) : errorAPI ? (
        /* ERROR HANDLING STATE DENGAN TOMBOL RETRY */
        <div className="border border-red-200 bg-red-50 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wide">Terjadi Kesalahan Jaringan</h4>
              <p className="text-xs text-red-750 leading-relaxed mt-0.5">{errorAPI}</p>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-xs tracking-wide shadow transition cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Box: Estimasi Biaya */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Landmark className="h-4.5 w-4.5 text-neutral-900" />
              <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Estimasi Biaya Perbaikan</h3>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-950">
                Rp {servisData?.estimasiBiaya?.min?.toLocaleString('id-ID')} - Rp {servisData?.estimasiBiaya?.max?.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-neutral-400 mt-1">
                *Biaya bervariasi tergantung kerumitan sirkuit, ketersediaan komponen pengganti, dan tarif teknisi di wilayah Anda.
              </p>
            </div>
          </div>

          {/* Box: Estimasi Waktu Servis */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Clock className="h-4.5 w-4.5 text-neutral-900" />
              <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Estimasi Waktu Kerja</h3>
            </div>
            <p className="text-sm font-semibold text-neutral-850">
              {servisData?.estimasiWaktu || '1-3 hari kerja'}
            </p>
          </div>

          {/* Box: Daftar Komponen yang Diperiksa */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Wrench className="h-4.5 w-4.5 text-neutral-900" />
              <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Daftar Komponen yang Diperiksa</h3>
            </div>
            <ul className="space-y-2 pl-4 list-disc">
              {servisData?.komponenDiperiksa?.map((item, idx) => (
                <li key={idx} className="text-xs text-neutral-700 leading-relaxed">
                  {item}
                </li>
              )) || (
                <li className="text-xs text-neutral-500">Komponen utama terkait kerusakan.</li>
              )}
            </ul>
          </div>

          {/* Box: Tips Sebelum ke Servis */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <ShieldAlert className="h-4.5 w-4.5 text-neutral-900" />
              <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Tips Sebelum Membawa ke Servis</h3>
            </div>
            <ul className="space-y-2 pl-4 list-disc">
              {servisData?.tipsCariServis?.map((item, idx) => (
                <li key={idx} className="text-xs text-neutral-700 leading-relaxed">
                  {item}
                </li>
              )) || (
                <li className="text-xs text-neutral-500">Minta garansi perbaikan minimal 1 bulan.</li>
              )}
            </ul>
          </div>

          {/* Selesai Button */}
          <div className="flex justify-end pt-4">
            <Link
              href="/riwayat"
              className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-xs tracking-wide shadow transition"
            >
              Lihat Riwayat Diagnosa
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
