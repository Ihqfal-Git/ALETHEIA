'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Key, ShieldCheck, AlertCircle, Save, Trash2, Eye, EyeOff, Loader2, LogOut, LogIn } from 'lucide-react';

export default function PengaturanPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedKeyExists, setSavedKeyExists] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Auth states untuk mobile view
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Test states
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('custom_gemini_api_key') || '';
      setApiKey(savedKey);
      setSavedKeyExists(!!savedKey);

      // Load auth info
      const loggedIn = localStorage.getItem('aletheia_logged_in') === 'true';
      setIsLoggedIn(loggedIn);
      setUsername(localStorage.getItem('aletheia_logged_in_user') || '');
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aletheia_logged_in');
      localStorage.removeItem('aletheia_logged_in_user');
      const newUuid = 'usr_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('aletheia_user_uuid', newUuid);
      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const cleanKey = apiKey.trim();
      if (cleanKey) {
        localStorage.setItem('custom_gemini_api_key', cleanKey);
        setSavedKeyExists(true);
        setMessage({ type: 'success', text: 'API Key kustom berhasil disimpan di browser Anda!' });
      } else {
        handleDelete();
      }
    }
  };

  const handleDelete = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('custom_gemini_api_key');
      setApiKey('');
      setSavedKeyExists(false);
      setTestResult(null);
      setMessage({ type: 'info', text: 'API Key kustom telah dihapus. Sistem akan menggunakan API Key bawaan server.' });
    }
  };

  const handleTestConnection = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTestResult({ success: false, message: 'Masukkan API Key terlebih dahulu sebelum melakukan tes.' });
      return;
    }

    setTesting(true);
    setTestResult(null);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': keyToTest
        },
        body: JSON.stringify({
          perangkat: 'laptop',
          kerusakan: 'Test Koneksi API Key kustom',
          gejalaCocok: ['Tes Gejala']
        })
      });

      const data = await res.json();
      if (data.success && !data.fallback) {
        setTestResult({
          success: true,
          message: 'Koneksi Sukses! API Key valid dan Gemini merespon dengan baik.'
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Uji coba gagal: Gemini API menolak permintaan (menggunakan data simulasi fallback). Mohon verifikasi kembali API Key Anda.'
        });
      }
    } catch (err) {
      console.error(err);
      setTestResult({
        success: false,
        message: 'Gagal menghubungi server atau gangguan koneksi jaringan.'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-4">
      {/* Back Button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Beranda
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-neutral-950">
          Pengaturan API Key Gemini
        </h1>
        <p className="text-sm text-neutral-500">
          Kelola kunci kustom secara mandiri untuk menghindari limit kuota API bawaan sistem.
        </p>
      </div>

      {/* Main Settings Form Card */}
      <div className="border border-neutral-200 bg-white rounded-2xl p-6 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest block">
              Gemini API Key Kustom Anda
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan API Key (misal: AIzaSy...)"
                className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 font-mono text-neutral-950"
              />
              <Key className="absolute left-3.5 h-4.5 w-4.5 text-neutral-400" />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 transition"
              >
                {showKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Dapatkan API Key secara gratis di 
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-900 font-bold underline ml-1 hover:text-neutral-700"
              >
                Google AI Studio
              </a>.
            </p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl border text-xs flex gap-2.5 items-start ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : message.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              {message.type === 'success' ? (
                <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-xl text-sm transition shadow cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Simpan Kunci
            </button>
            
            {savedKeyExists && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-3 border border-red-200 bg-white hover:bg-red-50/50 text-red-600 font-bold rounded-xl text-sm transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Kunci Kustom
              </button>
            )}
            
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !apiKey.trim()}
              className="flex items-center gap-2 px-4 py-3 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 font-bold rounded-xl text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menguji...
                </>
              ) : (
                <>
                  Tes Koneksi
                </>
              )}
            </button>
          </div>
        </form>

        {/* Test Result Display */}
        {testResult && (
          <div className={`p-5 rounded-xl border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            testResult.success 
              ? 'bg-green-50/60 border-green-200' 
              : 'bg-red-50/60 border-red-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {testResult.success ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Uji Coba Sukses</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800">Uji Coba Gagal</span>
                </>
              )}
            </div>
            <p className={`text-xs leading-relaxed ${
              testResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </p>
          </div>
        )}
      </div>

      {/* Account Section - Mobile Only */}
      <div className="block md:hidden border border-neutral-200 bg-white rounded-2xl p-6 shadow-sm space-y-4">
        {isLoggedIn ? (
          <>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-950">Akun Anda</h3>
              <p className="text-xs text-neutral-505">
                Masuk sebagai: <span className="font-extrabold text-neutral-900">{username}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 bg-red-50 hover:bg-red-100/60 text-red-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Keluar dari Akun
            </button>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-950">Akun Anda</h3>
              <p className="text-xs text-neutral-505">
                Anda masuk sebagai: <span className="font-extrabold text-neutral-900">Tamu / Guest</span>
              </p>
            </div>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-xl text-xs transition shadow cursor-pointer text-center"
            >
              <LogIn className="h-4 w-4" />
              Masuk Sekarang
            </Link>
          </>
        )}
      </div>

      {/* Info Card */}
      <div className="border border-neutral-200 bg-neutral-50/80 rounded-2xl p-5 text-xs space-y-3 leading-relaxed text-neutral-600">
        <p className="font-bold text-neutral-900">Catatan Privasi & Keamanan:</p>
        <ul className="list-disc pl-4 space-y-1.5">
          <li>API Key kustom disimpan secara lokal di browser Anda menggunakan **LocalStorage**.</li>
          <li>Kunci ini **tidak akan disimpan di database server** proyek ALETHEIA.</li>
          <li>Setiap panggilan diagnosa ke backend akan langsung menyertakan kunci kustom Anda di header permintaan untuk digunakan secara *real-time*.</li>
          <li>Kapan saja Anda ingin berhenti menggunakannya, cukup klik tombol **&quot;Hapus Kunci Kustom&quot;** di atas.</li>
        </ul>
      </div>
    </div>
  );
}
