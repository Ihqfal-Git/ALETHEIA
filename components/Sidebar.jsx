'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Laptop, Smartphone, Monitor, ClipboardList, Info, LogOut, User, Zap } from 'lucide-react';

export default function Sidebar({ onCloseMobile }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');

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

  // Helper untuk menentukan apakah link perangkat aktif
  const isPerangkatActive = (slug) => {
    return pathname === `/diagnosa/${slug}` || pathname.includes(`/diagnosa/${slug}`);
  };

  // Helper untuk halaman umum
  const isPageActive = (path) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-white text-neutral-700">
      <div className="flex flex-col">
        <div className="p-6 border-b border-neutral-100 flex items-center">
          <Link href="/" onClick={handleLinkClick} className="flex items-center gap-1.5 font-black text-xl tracking-tight text-neutral-950">
            <Zap className="h-5 w-5 text-neutral-950 fill-neutral-950" />
            <span>ALETHEIA</span>
          </Link>
        </div>

        {/* Section Perangkat */}
        <div className="mt-6 px-4">
          <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            Perangkat
          </p>
          <nav className="space-y-1">
            <Link
              href="/diagnosa/laptop"
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isPerangkatActive('laptop')
                  ? 'bg-neutral-100 text-neutral-950 font-semibold'
                  : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950'
                }
              `}
            >
              <Laptop className="h-4.5 w-4.5" />
              <span>Laptop</span>
            </Link>

            <Link
              href="/diagnosa/hp"
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isPerangkatActive('hp')
                  ? 'bg-neutral-100 text-neutral-950 font-semibold'
                  : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950'
                }
              `}
            >
              <Smartphone className="h-4.5 w-4.5" />
              <span>Handphone</span>
            </Link>

            <Link
              href="/diagnosa/pc"
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isPerangkatActive('pc')
                  ? 'bg-neutral-100 text-neutral-950 font-semibold'
                  : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950'
                }
              `}
            >
              <Monitor className="h-4.5 w-4.5" />
              <span>PC / Desktop</span>
            </Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-100" />

        {/* Section Lainnya */}
        <div className="px-4 space-y-1">
          <Link
            href="/riwayat"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isPageActive('/riwayat')
                ? 'bg-neutral-100 text-neutral-950 font-semibold'
                : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950'
              }
            `}
          >
            <ClipboardList className="h-4.5 w-4.5" />
            <span>Riwayat Diagnosa</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-100" />

        <div className="px-4 space-y-1">
          <Link
            href="/tentang"
            onClick={handleLinkClick}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isPageActive('/tentang')
                ? 'bg-neutral-100 text-neutral-950 font-semibold'
                : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-950'
              }
            `}
          >
            <Info className="h-4.5 w-4.5" />
            <span>Tentang Sistem</span>
          </Link>
        </div>
      </div>

      {/* User Session Area */}
      <div className="mx-4 p-3 mb-2 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between gap-2 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          {isLoggedIn ? (
            <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 select-none">
              <User className="h-4 w-4" />
            </div>
          )}
          <div className="truncate">
            {isLoggedIn ? (
              <>
                <p className="text-xs font-black text-neutral-900 truncate leading-tight">{username}</p>
                <p className="text-[10px] text-neutral-500 truncate leading-none mt-0.5">{username.toLowerCase()}@aletheia.com</p>
              </>
            ) : (
              <>
                <p className="text-xs font-black text-neutral-900 truncate leading-tight">Tamu</p>
                <p className="text-[10px] text-neutral-400 truncate leading-none mt-0.5">Belum masuk</p>
              </>
            )}
          </div>
        </div>
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            className="p-1.5 hover:bg-red-50 hover:text-red-600 text-neutral-400 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Keluar Akun"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Link 
            href="/login"
            onClick={handleLinkClick}
            className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-lg text-[10px] transition cursor-pointer select-none shrink-0"
          >
            Masuk
          </Link>
        )}
      </div>

      <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
        <p className="text-[10px] text-center text-neutral-400">© 2026 ALETHEIA</p>
      </div>
    </aside>
  );
}
