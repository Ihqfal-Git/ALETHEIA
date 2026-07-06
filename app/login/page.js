'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, User, Home, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  useEffect(() => {
    // Jika sudah login, langsung alihkan ke riwayat
    const loggedIn = localStorage.getItem('aletheia_logged_in') === 'true';
    if (loggedIn) {
      router.push('/riwayat');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setAuthError('Username dan Password wajib diisi.');
      return;
    }
    
    setSubmittingAuth(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await response.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('aletheia_logged_in', 'true');
          localStorage.setItem('aletheia_logged_in_user', data.username);
          localStorage.setItem('aletheia_user_uuid', data.username);
        }
        setAuthSuccess('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          // Redirect ke riwayat dan reload halaman agar sidebar terupdate
          router.push('/riwayat');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }, 800);
      } else {
        setAuthError(data.error || 'Username atau Password salah.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Terjadi kesalahan koneksi server.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!usernameInput.trim() || !passwordInput.trim() || (isRegisterMode && !confirmPasswordInput.trim())) {
      setAuthError('Semua kolom formulir wajib diisi.');
      return;
    }
    if (usernameInput.trim().length < 3) {
      setAuthError('Username minimal 3 karakter.');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setAuthError('Konfirmasi password tidak cocok.');
      return;
    }

    setSubmittingAuth(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await response.json();
      if (data.success) {
        setAuthSuccess('Registrasi berhasil! Silakan masuk.');
        setIsRegisterMode(false);
        setPasswordInput('');
        setConfirmPasswordInput('');
      } else {
        setAuthError(data.error || 'Gagal mendaftarkan akun.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Terjadi kesalahan koneksi server.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-900 border border-neutral-200">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-black text-neutral-950">
            {isRegisterMode ? 'Daftar Akun Baru' : 'Masuk ke Sistem'}
          </h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            {isRegisterMode 
              ? 'Buat akun baru untuk mulai menyimpan dan melihat riwayat diagnosa perangkat Anda.' 
              : 'Silakan masuk ke akun Anda untuk mengakses fitur personalisasi sistem pakar.'
            }
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-lg">
          <button
            onClick={() => {
              setIsRegisterMode(false);
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`py-1.5 text-xs font-bold rounded-md transition cursor-pointer select-none ${!isRegisterMode ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Masuk
          </button>
          <button
            onClick={() => {
              setIsRegisterMode(true);
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`py-1.5 text-xs font-bold rounded-md transition cursor-pointer select-none ${isRegisterMode ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Masukkan username..."
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 bg-neutral-50/50"
                disabled={submittingAuth}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="password"
                placeholder="Masukkan password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 bg-neutral-50/50"
                disabled={submittingAuth}
              />
            </div>
          </div>

          {isRegisterMode && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  placeholder="Ulangi password..."
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 bg-neutral-50/50"
                  disabled={submittingAuth}
                />
              </div>
            </div>
          )}

          {authError && (
            <p className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg animate-fade-in">
              {authError}
            </p>
          )}

          {authSuccess && (
            <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg animate-fade-in">
              {authSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={submittingAuth}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-xs tracking-wide shadow-sm transition cursor-pointer select-none disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {submittingAuth 
              ? (isRegisterMode ? 'Mendaftar...' : 'Memproses...') 
              : (isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Akun')
            }
          </button>
        </form>
      </div>

      {/* Sticky Home Button Footer */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/95 backdrop-blur py-4 px-4 sm:px-6 md:px-12 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center h-[42px] w-[42px] sm:w-auto sm:px-4 sm:gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950 transition-colors shadow-sm shrink-0"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:block text-xs font-bold">Kembali</span>
        </Link>
      </div>
    </div>
  );
}
