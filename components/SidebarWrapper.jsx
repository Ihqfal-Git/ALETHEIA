'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { Home, Laptop, Smartphone, Monitor, ClipboardList, Info, Zap, User, Settings, Cpu, X } from 'lucide-react';


export default function SidebarWrapper({ children }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = React.useState(false);

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
    { href: '#perangkat', label: 'Perangkat', icon: Cpu, isPopupTrigger: true },
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
          const isActive = item.isPopupTrigger 
            ? (pathname.startsWith('/diagnosa/') || isMobilePopupOpen)
            : (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

          if (item.isPopupTrigger) {
            return (
              <button
                key={item.label}
                onClick={() => setIsMobilePopupOpen(!isMobilePopupOpen)}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors border-none bg-transparent cursor-pointer ${
                  isActive ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.href === '/' ? handleGoHome : undefined}
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

      {/* Mobile Pop-up Balloon (Speech Bubble from Bottom) */}
      {isMobilePopupOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-neutral-950/20 backdrop-blur-sm z-[9998] animate-fade-in"
            onClick={() => setIsMobilePopupOpen(false)}
          />

          {/* Balloon Popover Card */}
          <div className="md:hidden fixed bottom-20 left-4 right-4 z-[9999] bg-white rounded-2xl border border-neutral-200 shadow-2xl p-4 animate-balloon-pop-mobile max-w-sm mx-auto">
            {/* Arrow/Tail pointing down aligned to Perangkat item (second item of 4, ~37.5% from left) */}
            <div className="absolute -bottom-1.5 left-[37.5%] -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-neutral-200 rotate-45 z-10" />

            {/* Header Popover */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100 relative z-20">
              <h2 className="font-black text-xs text-neutral-950 tracking-tight flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-neutral-900" />
                Pilih Perangkat
              </h2>
              <button 
                onClick={() => setIsMobilePopupOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-950 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Device list */}
            <div className="space-y-2 relative z-20">
              <Link
                href="/diagnosa/laptop?new=true"
                onClick={() => { setIsMobilePopupOpen(false); handleGoHome(); }}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-950 hover:bg-neutral-50/50 transition active:bg-neutral-50 group cursor-pointer"
              >
                <div className="p-2.5 bg-neutral-50 group-hover:bg-neutral-950 rounded-lg text-neutral-900 group-hover:text-white transition duration-200">
                  <Laptop className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-neutral-950">Laptop</h4>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">Diagnosa baterai, keyboard, layar, dll.</p>
                </div>
              </Link>

              <Link
                href="/diagnosa/hp?new=true"
                onClick={() => { setIsMobilePopupOpen(false); handleGoHome(); }}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-950 hover:bg-neutral-50/50 transition active:bg-neutral-50 group cursor-pointer"
              >
                <div className="p-2.5 bg-neutral-50 group-hover:bg-neutral-950 rounded-lg text-neutral-900 group-hover:text-white transition duration-200">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-neutral-950">Handphone</h4>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">Diagnosa LCD, layar sentuh, dll.</p>
                </div>
              </Link>

              <Link
                href="/diagnosa/pc?new=true"
                onClick={() => { setIsMobilePopupOpen(false); handleGoHome(); }}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-950 hover:bg-neutral-50/50 transition active:bg-neutral-50 group cursor-pointer"
              >
                <div className="p-2.5 bg-neutral-50 group-hover:bg-neutral-950 rounded-lg text-neutral-900 group-hover:text-white transition duration-200">
                  <Monitor className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-neutral-950">PC / Desktop</h4>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">Diagnosa RAM, VGA, boot loop, dll.</p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
