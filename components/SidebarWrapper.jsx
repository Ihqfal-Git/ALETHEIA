'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { Laptop, Smartphone, Monitor, ClipboardList, Info } from 'lucide-react';

export default function SidebarWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingUuid = localStorage.getItem('aletheia_user_uuid');
      if (!existingUuid) {
        const newUuid = 'usr_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('aletheia_user_uuid', newUuid);
      }
    }
  }, []);

  const navItems = [
    { href: '/diagnosa/laptop', label: 'Laptop', icon: Laptop },
    { href: '/diagnosa/hp', label: 'HP', icon: Smartphone },
    { href: '/diagnosa/pc', label: 'PC', icon: Monitor },
    { href: '/riwayat', label: 'Riwayat', icon: ClipboardList },
    { href: '/tentang', label: 'Tentang', icon: Info },
  ];

  // Jika di halaman beranda, layout sangat simpel tanpa sidebar
  if (pathname === '/') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="border-b border-neutral-100 py-5 px-6 md:px-12 bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center">
            <span className="font-black text-xl tracking-tight text-neutral-950">ALETHEIA</span>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Jika bukan halaman beranda, tampilkan layout dengan sidebar (desktop) atau bottom nav (mobile)
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Mobile Top Header (hanya muncul di layar kecil) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-40">
        <Link href="/" className="font-black text-base tracking-tight text-neutral-950 flex items-center gap-1.5">
          <span>⚡</span> <span>ALETHEIA</span>
        </Link>
      </div>

      {/* Sidebar untuk Desktop */}
      <div className="hidden md:block sticky top-0 left-0 w-[240px] shrink-0 border-r border-neutral-200 bg-white h-screen">
        <Sidebar />
      </div>

      {/* Konten Kanan */}
      <main className="flex-1 h-screen overflow-y-auto bg-neutral-50 p-6 md:p-10 lg:p-12 w-full pb-28 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (hanya muncul di layar kecil) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 h-16 flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors ${
                isActive ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
