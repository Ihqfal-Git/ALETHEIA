'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, Wrench, ShieldAlert, Clock, AlertTriangle, Coins, BarChart3, Hammer, AlertCircle } from 'lucide-react';

export default function SolusiMandiriPage() {
  const [deviceSlug, setDeviceSlug] = useState('');
  const [riwayatId, setRiwayatId] = useState(null);
  const [kerusakanNama, setKerusakanNama] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);

  // States untuk API AI
  const [mandiriData, setMandiriData] = useState(null);
  const [loadingAPI, setLoadingAPI] = useState(true);
  const [errorAPI, setErrorAPI] = useState('');

  const fetchMandiriInfo = async (slugVal, kerusakanVal, riwayatVal) => {
    setLoadingAPI(true);
    setErrorAPI('');
    try {
      const response = await fetch('/api/ai/mandiri', {
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
        setMandiriData(resData.data);
      } else {
        throw new Error(resData.error || 'Gagal memuat panduan mandiri AI.');
      }
    } catch (err) {
      console.error(err);
      setErrorAPI('Gagal mengambil panduan perbaikan dari server.');
    } finally {
      setLoadingAPI(false);
    }
  };

  useEffect(() => {
    const savedHasilDiagnosa = sessionStorage.getItem('hasilDiagnosa');
    let targetSlug = '';
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
        console.error('Gagal parse hasilDiagnosa di solusi/mandiri', err);
      }
    } else {
      // Legacy fallback
      const savedHasil = sessionStorage.getItem('aletheia_diagnosa_hasil');
      const savedRiwayatId = sessionStorage.getItem('aletheia_diagnosa_riwayat_id');
      const savedDeviceSlug = sessionStorage.getItem('aletheia_diagnosa_device_slug');

      if (savedHasil) {
        const hasilArr = JSON.parse(savedHasil);
        if (hasilArr.length > 0) {
          targetKerusakan = hasilArr[0].kerusakan.nama;
          setKerusakanNama(targetKerusakan);
        }
      }
      if (savedDeviceSlug) { targetSlug = savedDeviceSlug; setDeviceSlug(targetSlug); }
      if (savedRiwayatId) { targetRiwayatId = savedRiwayatId; setRiwayatId(targetRiwayatId); }
    }

    setLoadingSession(false);

    if (targetKerusakan) {
      fetchMandiriInfo(targetSlug, targetKerusakan, targetRiwayatId);
    } else {
      setLoadingAPI(false);
    }
  }, []);

  const handleRetry = () => {
    if (kerusakanNama) {
      fetchMandiriInfo(deviceSlug, kerusakanNama, riwayatId);
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
          <Wrench className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">Data Tidak Ditemukan</h3>
        <p className="text-xs leading-relaxed text-neutral-500">
          Sesi diagnosis tidak ditemukan. Silakan lakukan diagnosis baru.
        </p>
        <div className="pt-2">
          <Link href="/" className="inline-block px-5 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-semibold rounded-lg text-xs transition">
            Mulai Diagnosa Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Navigation header */}
      <div>
        <Link href="/hasil" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Hasil Diagnosa
        </Link>
      </div>

      {/* Main Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Panduan Perbaikan Mandiri</span>
        <h1 className="text-2xl md:text-3xl font-black text-neutral-950">
          Perbaiki Sendiri: {kerusakanNama}
        </h1>
        <p className="text-sm text-neutral-500">
          Panduan langkah demi langkah dan kebutuhan material untuk perbaikan mandiri
        </p>
      </div>

      {loadingAPI ? (
        /* SKELETON LOADER */
        <div className="space-y-6">
          {/* Skeleton Peringatan */}
          <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-5 animate-pulse space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
          </div>
          {/* Skeleton Grid Alat & Bahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-neutral-200 bg-white rounded-xl p-6 animate-pulse space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
              <div className="h-3 bg-neutral-200 rounded w-full"></div>
              <div className="h-3 bg-neutral-200 rounded w-11/12"></div>
              <div className="h-3 bg-neutral-200 rounded w-4/5"></div>
            </div>
            <div className="border border-neutral-200 bg-white rounded-xl p-6 animate-pulse space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
              <div className="h-3 bg-neutral-200 rounded w-full"></div>
              <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
            </div>
          </div>
          {/* Skeleton Langkah */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 animate-pulse space-y-4">
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="space-y-3 ml-4 pl-6 border-l border-neutral-100">
              <div className="space-y-1">
                <div className="h-3.5 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-3 bg-neutral-100 rounded w-4/5"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3.5 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-3 bg-neutral-100 rounded w-3/4"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3.5 bg-neutral-200 rounded w-1/5"></div>
                <div className="h-3 bg-neutral-100 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          {/* Skeleton Info Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-neutral-200 bg-neutral-50 rounded-xl p-5 animate-pulse flex items-center gap-3">
                <div className="h-10 w-10 bg-neutral-200 rounded-lg"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 bg-neutral-200 rounded w-2/3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : errorAPI ? (
        /* ERROR STATE */
        <div className="border border-red-200 bg-red-50 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wide">Terjadi Kesalahan</h4>
              <p className="text-xs text-red-700 leading-relaxed mt-0.5">{errorAPI}</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-lg text-xs tracking-wide shadow transition cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Box Peringatan */}
          {mandiriData?.peringatan && mandiriData.peringatan.length > 0 && (
            <div className="border border-red-200 bg-red-50 text-red-950 rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <h4 className="font-extrabold text-xs uppercase tracking-wide">Peringatan Penting</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {mandiriData.peringatan.map((warn, idx) => (
                  <li key={idx} className="text-xs text-red-900 leading-relaxed">{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Grid Kebutuhan: Alat & Bahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box: Daftar Alat */}
            <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <Hammer className="h-4.5 w-4.5 text-neutral-900" />
                <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Daftar Alat yang Dibutuhkan</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2 font-bold">Nama Alat</th>
                      <th className="pb-2 font-bold pl-4">Fungsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {mandiriData?.alat?.map((item, idx) => (
                      <tr key={idx} className="text-neutral-700">
                        <td className="py-2.5 font-bold text-neutral-950">{item.nama}</td>
                        <td className="py-2.5 pl-4 text-neutral-500 leading-normal">{item.fungsi}</td>
                      </tr>
                    )) || (
                      <tr><td className="py-2 text-neutral-400" colSpan={2}>Tidak ada data alat.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Box: Daftar Bahan + Estimasi Harga */}
            <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <Coins className="h-4.5 w-4.5 text-neutral-900" />
                <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Daftar Bahan & Estimasi Harga</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2 font-bold">Nama Bahan</th>
                      <th className="pb-2 font-bold pl-4 text-right">Estimasi Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {mandiriData?.bahan?.map((item, idx) => (
                      <tr key={idx} className="text-neutral-700">
                        <td className="py-2.5 font-bold text-neutral-950">{item.nama}</td>
                        <td className="py-2.5 pl-4 text-right text-neutral-600 font-medium">{item.estimasiHarga}</td>
                      </tr>
                    )) || (
                      <tr><td className="py-2 text-neutral-400" colSpan={2}>Tidak ada data bahan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Box: Langkah Perbaikan Bernomor */}
          <div className="border border-neutral-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Wrench className="h-4.5 w-4.5 text-neutral-900" />
              <h3 className="font-bold text-xs text-neutral-950 uppercase tracking-wide">Langkah-Langkah Perbaikan</h3>
            </div>
            <div className="relative border-l border-neutral-100 ml-4 pl-6 space-y-6">
              {mandiriData?.langkah?.map((step, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-10 top-0.5 bg-neutral-950 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-black select-none">
                    {step.nomor || idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-neutral-950 text-xs uppercase tracking-wider">{step.judul}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              )) || (
                <p className="text-xs text-neutral-400">Tidak ada data langkah perbaikan.</p>
              )}
            </div>
          </div>

          {/* Info Bawah: Estimasi Biaya, Waktu, Kesulitan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-5 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-white border border-neutral-100 rounded-lg text-neutral-900">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Estimasi Biaya Total</span>
                <span className="text-sm font-extrabold text-neutral-950">
                  Rp {mandiriData?.estimasiBiayaTotal?.min?.toLocaleString('id-ID')} - Rp {mandiriData?.estimasiBiayaTotal?.max?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-5 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-white border border-neutral-100 rounded-lg text-neutral-900">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Estimasi Durasi</span>
                <span className="text-sm font-extrabold text-neutral-950">
                  {mandiriData?.estimasiWaktu || '30 - 60 menit'}
                </span>
              </div>
            </div>
            <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-5 shadow-sm flex items-center gap-3">
              <div className="p-2.5 bg-white border border-neutral-100 rounded-lg text-neutral-900">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Tingkat Kesulitan</span>
                <span className="text-sm font-extrabold text-neutral-950">
                  {mandiriData?.tingkatKesulitan || 'Menengah'}
                </span>
              </div>
            </div>
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
