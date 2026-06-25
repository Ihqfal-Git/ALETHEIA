'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Laptop, Smartphone, Monitor, ClipboardList, Info } from 'lucide-react';

export default function Sidebar({ onCloseMobile }) {
  const pathname = usePathname();

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
        {/* Logo Section */}
        <div className="p-6 border-b border-neutral-100 flex items-center">
          <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight text-neutral-950">⚡ ALETHEIA</span>
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

      {/* Footer minimalis */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
        <p className="text-[10px] text-center text-neutral-400">© 2026 ALETHEIA</p>
      </div>
    </aside>
  );
}
