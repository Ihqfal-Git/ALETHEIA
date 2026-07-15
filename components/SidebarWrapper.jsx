'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { Home, Laptop, Smartphone, Monitor, ClipboardList, Info, Zap, User, Settings } from 'lucide-react';


export default function SidebarWrapper({ children }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingUuid = localStorage.getItem('aletheia_user_uuid');
      if (!existingUuid) {
        const newUuid = 'usr_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('aletheia_user_uuid', newUuid);
      }
      setIsLoggedIn(localStorage.getItem('aletheia_logged_in') === 'true');
      setUsername(localStorage.getItem('aletheia_logged_in_user') || '');

      const savedCollapsed = localStorage.getItem('aletheia_sidebar_collapsed') === 'true';
      setIsSidebarCollapsed(savedCollapsed);

      // Override window.fetch to inject dynamic custom API key header
      const originalFetch = window.fetch;
      window.fetch = async function (input, init) {
        let modifiedInit = init;
        let url = '';
        if (typeof input === 'string') {
          url = input;
        } else if (input && input.url) {
          url = input.url;
        }
        
        if (url.includes('/api/ai/')) {
          const customKey = localStorage.getItem('custom_gemini_api_key');
          if (customKey) {
            modifiedInit = init ? { ...init } : {};
            const headers = modifiedInit.headers ? { ...modifiedInit.headers } : {};
            headers['x-gemini-api-key'] = customKey;
            modifiedInit.headers = headers;
          }
        }
        return originalFetch(input, modifiedInit);
      };
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('aletheia_sidebar_collapsed', String(next));
      return next;
    });
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

  const navItems = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/diagnosa/laptop', label: 'Laptop', icon: Laptop },
    { href: '/diagnosa/hp', label: 'HP', icon: Smartphone },
    { href: '/diagnosa/pc', label: 'PC', icon: Monitor },
    { href: '/riwayat', label: 'Riwayat', icon: ClipboardList },
    { href: '/tentang', label: 'Tentang', icon: Info },
  ];

  // Jika di halaman login, tampilkan bersih tanpa sidebar dan header
  if (pathname === '/login') {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center w-full">
        {children}
      </main>
    );
  }


  // Jika bukan halaman beranda, tampilkan layout dengan sidebar (desktop) atau bottom nav (mobile)
  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden w-full"
      style={{ '--sidebar-width': isSidebarCollapsed ? '72px' : '240px' }}
    >
      {/* Mobile Top Header (hanya muncul di layar kecil) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-40">
        <Link href="/" onClick={handleGoHome} className="font-black text-base tracking-tight text-neutral-950 flex items-center gap-1.5">
          <Zap className="h-4.5 w-4.5 text-neutral-950 fill-neutral-950" />
          <span>ALETHEIA</span>
        </Link>
        <Link
          href="/pengaturan"
          className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600 hover:text-neutral-950 transition-colors"
          title="Pengaturan API Key"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      {/* Sidebar untuk Desktop */}
      <div className={`hidden md:block sticky top-0 left-0 transition-all duration-300 shrink-0 border-r border-neutral-200 bg-white h-screen z-40 ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}>
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
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
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.href === '/' ? handleGoHome : undefined}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors ${isActive ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-600'
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
