'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Laptop, Smartphone, Monitor, ClipboardList, Info, LogOut, User, Zap, ChevronLeft, Settings, Cpu, X } from 'lucide-react';

export default function Sidebar({ onCloseMobile, isCollapsed = false, onToggle }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('aletheia_logged_in') === 'true';
      setIsLoggedIn(loggedIn);
      setUsername(localStorage.getItem('aletheia_logged_in_user') || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aletheia_logged_in');
    localStorage.removeItem('aletheia_logged_in_user');
    const newUuid = 'usr_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('aletheia_user_uuid', newUuid);
    window.location.reload();
  };

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hasilDiagnosa');
      sessionStorage.removeItem('pilihanSolusi');
      sessionStorage.removeItem('aletheia_diagnosa_hasil');
      sessionStorage.removeItem('aletheia_diagnosa_riwayat_id');
      sessionStorage.removeItem('aletheia_diagnosa_selected_ids');
      sessionStorage.removeItem('aletheia_diagnosa_device_name');
      sessionStorage.removeItem('aletheia_diagnosa_device_slug');
      sessionStorage.removeItem('aletheia_diagnosa_tambahan');
      sessionStorage.removeItem('aletheia_diagnosa_solusi');
    }
  };

  // Helper untuk menentukan apakah link perangkat aktif
  const isPerangkatActive = (slug) => {
    // 1. Aktif jika sedang berada di halaman checklist diagnosa perangkat tersebut
    if (pathname === `/diagnosa/${slug}` || pathname.includes(`/diagnosa/${slug}`)) {
      return true;
    }
    
    // 2. Aktif jika sedang di halaman hasil atau solusi, dan perangkat aktif di sesi adalah perangkat ini
    if (pathname === '/hasil' || pathname.startsWith('/solusi/')) {
      if (typeof window !== 'undefined') {
        const savedHasil = sessionStorage.getItem('hasilDiagnosa');
        if (savedHasil) {
          try {
            const parsed = JSON.parse(savedHasil);
            if (parsed.perangkat === slug) {
              return true;
            }
          } catch (e) {
            console.error(e);
          }
        }
        const savedSlug = sessionStorage.getItem('aletheia_diagnosa_device_slug');
        if (savedSlug === slug) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Helper untuk halaman umum
  const isPageActive = (path) => {
    return pathname === path || pathname.startsWith(path);
  };

  // Generator class link untuk konsistensi ukuran dan transisi
  const getLinkClass = (isActive) => {
    return `
      flex items-center rounded-lg text-sm font-medium transition-all duration-300 select-none
      ${isCollapsed 
        ? 'w-10 h-10 justify-center mx-auto' 
        : 'gap-3 px-3 py-2.5 w-full'
      }
      ${isActive 
        ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm' 
        : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950'
      }
    `;
  };

  // Generator class logo
  const getLogoClass = () => {
    return `
      flex items-center transition-all duration-300 select-none font-black text-xl tracking-tight text-neutral-950
      ${isCollapsed ? 'justify-center mx-auto' : 'gap-1.5'}
    `;
  };

  const dividerClass = `border-t border-neutral-100 transition-all duration-300 ${isCollapsed ? 'my-2 mx-4' : 'my-3 mx-4'}`;

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-white text-neutral-700 relative">
      {/* Floating Expand/Collapse Button for Desktop */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="hidden md:flex absolute top-6 -right-3 w-6 h-6 rounded-full border border-neutral-200 bg-white items-center justify-center shadow-sm text-neutral-400 hover:text-neutral-950 hover:shadow-md transition-all cursor-pointer z-50"
          title={isCollapsed ? "Kembangkan Sidebar" : "Ciutkan Sidebar"}
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      )}

      <div className="flex flex-col">
        {/* Logo Header */}
        <div className={`border-b border-neutral-100 flex items-center transition-all duration-300 ${
          isCollapsed ? 'h-[72px] justify-center px-0' : 'h-[72px] px-6 justify-between'
        }`}>
          <Link href="/" onClick={() => { handleGoHome(); handleLinkClick(); }} className={getLogoClass()}>
            <Zap className="h-5.5 w-5.5 text-neutral-950 fill-neutral-950 shrink-0" />
            {!isCollapsed && <span>ALETHEIA</span>}
          </Link>
        </div>

        {/* Section Utama */}
        <div className={`mt-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={() => { handleGoHome(); handleLinkClick(); }}
              className={getLinkClass(pathname === '/')}
              title={isCollapsed ? "Beranda" : undefined}
            >
              <Home className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Beranda</span>}
            </Link>
          </nav>
        </div>

        {/* Divider 1 */}
        <div className={dividerClass} />

        {/* Section Perangkat */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 select-none">
              Perangkat
            </p>
          )}

          <nav className="space-y-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className={getLinkClass(isPerangkatActive('laptop') || isPerangkatActive('hp') || isPerangkatActive('pc'))}
              title={isCollapsed ? "Pilih Perangkat" : undefined}
            >
              <Cpu className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full text-left">
                  <span>Pilih Perangkat</span>
                </div>
              )}
            </button>
          </nav>
        </div>

        {/* Divider 2 */}
        <div className={dividerClass} />

        {/* Section Lainnya */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <nav className="space-y-1">
            <Link
              href="/riwayat"
              onClick={handleLinkClick}
              className={getLinkClass(isPageActive('/riwayat'))}
              title={isCollapsed ? "Riwayat Diagnosa" : undefined}
            >
              <ClipboardList className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Riwayat Diagnosa</span>}
            </Link>

            {/* Divider 3 */}
            <div className={dividerClass} />

            <Link
              href="/tentang"
              onClick={handleLinkClick}
              className={getLinkClass(isPageActive('/tentang'))}
              title={isCollapsed ? "Tentang Sistem" : undefined}
            >
              <Info className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Tentang Sistem</span>}
            </Link>

            <Link
              href="/pengaturan"
              onClick={handleLinkClick}
              className={getLinkClass(isPageActive('/pengaturan'))}
              title={isCollapsed ? "Pengaturan API Key" : undefined}
            >
              <Settings className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Pengaturan API Key</span>}
            </Link>
          </nav>
        </div>
      </div>

      {/* User Session Area */}
      <div className={`bg-neutral-50 border border-neutral-200 rounded-xl flex items-center overflow-hidden shadow-sm transition-all duration-300 ${
        isCollapsed ? 'mx-3 p-1.5 justify-center mb-3' : 'mx-4 p-3 justify-between mb-3'
      }`}>
        <div className="flex items-center gap-2 overflow-hidden w-full justify-center">
          {isLoggedIn ? (
            isCollapsed ? (
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-lg bg-neutral-950 hover:bg-neutral-900 text-white flex items-center justify-center font-bold transition-all duration-300 cursor-pointer shadow"
                title={`Keluar Akun (${username})`}
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-black text-neutral-900 truncate leading-tight">{username}</p>
                    <p className="text-[10px] text-neutral-500 truncate leading-none mt-0.5">{username.toLowerCase()}@aletheia.com</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-1.5 hover:bg-red-50 hover:text-red-600 text-neutral-400 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Keluar Akun"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          ) : (
            isCollapsed ? (
              <Link 
                href="/login"
                onClick={handleLinkClick}
                className="w-10 h-10 rounded-lg bg-neutral-200 text-neutral-600 flex items-center justify-center transition-all duration-300 hover:bg-neutral-950 hover:text-white cursor-pointer shadow-sm"
                title="Masuk Akun"
              >
                <User className="h-4.5 w-4.5" />
              </Link>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 select-none">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-black text-neutral-900 truncate leading-tight">Tamu</p>
                    <p className="text-[10px] text-neutral-400 truncate leading-none mt-0.5">Belum masuk</p>
                  </div>
                </div>
                <Link 
                  href="/login"
                  onClick={handleLinkClick}
                  className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-[10px] transition cursor-pointer select-none shrink-0"
                >
                  Masuk
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal / Pop-up Pilihan Perangkat */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h2 className="font-black text-sm text-neutral-950 tracking-tight flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-neutral-900" />
                Pilih Perangkat
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-950 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Body Modal (3 Device Options) */}
            <div className="p-5 space-y-2.5">
              <Link
                href="/diagnosa/laptop?new=true"
                onClick={() => { setIsModalOpen(false); handleGoHome(); handleLinkClick(); }}
                className="flex items-center gap-3.5 p-3 rounded-xl border border-neutral-200 hover:border-neutral-950 hover:bg-neutral-50/50 transition duration-300 group cursor-pointer"
              >
                <div className="p-2.5 bg-neutral-50 group-hover:bg-neutral-950 rounded-lg text-neutral-900 group-hover:text-white transition duration-300">
                  <Laptop className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-neutral-950">Laptop</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5 leading-normal">Kelistrikan, baterai, layar, keyboard, dll.</p>
                </div>
              </Link>

              <Link
                href="/diagnosa/hp?new=true"
                onClick={() => { setIsModalOpen(false); handleGoHome(); handleLinkClick(); }}
                className="flex items-center gap-3.5 p-3 rounded-xl border border-neutral-200 hover:border-neutral-950 hover:bg-neutral-50/50 transition duration-300 group cursor-pointer"
              >
                <div className="p-2.5 bg-neutral-50 group-hover:bg-neutral-950 rounded-lg text-neutral-900 group-hover:text-white transition duration-300">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-neutral-950">Handphone</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5 leading-normal">LCD, touchscreen, baterai kembung, dll.</p>
                </div>
              </Link>

              <Link
                href="/diagnosa/pc?new=true"
                onClick={() => { setIsModalOpen(false); handleGoHome(); handleLinkClick(); }}
                className="flex items-center gap-3.5 p-3 rounded-xl border border-neutral-200 hover:border-neutral-950 hover:bg-neutral-50/50 transition duration-300 group cursor-pointer"
              >
                <div className="p-2.5 bg-neutral-50 group-hover:bg-neutral-950 rounded-lg text-neutral-900 group-hover:text-white transition duration-300">
                  <Monitor className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-neutral-950">PC / Desktop</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5 leading-normal">Motherboard, RAM, VGA, power supply, dll.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
