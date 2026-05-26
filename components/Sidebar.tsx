"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex z-10 transition-all duration-300">
      <div className="h-20 flex items-center px-5 border-b border-gray-50 gap-2.5">
        <div className="relative w-7 h-7 flex-shrink-0">
          <Image
            src="/img/logo.png"
            alt="SmartBundle Logo"
            fill
            className="object-contain"
          />
        </div>
        <Link href="/" className="text-xl font-black text-gray-900 tracking-tight truncate">
          Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Bundle</span>
        </Link>
      </div>
      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <Link 
          href={`/dashboard${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
          className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
            pathname === '/dashboard' 
              ? 'text-amber-700 bg-amber-50/80 shadow-sm ring-1 ring-amber-100/50' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className={`w-5 h-5 mr-3 transition-transform duration-200 ${pathname !== '/dashboard' ? 'group-hover:scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/dashboard' ? 2.5 : 2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Overview
        </Link>
        <Link 
          href={`/dashboard/top-sales${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
          className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
            pathname === '/dashboard/top-sales' 
              ? 'text-amber-700 bg-amber-50/80 shadow-sm ring-1 ring-amber-100/50' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className={`w-5 h-5 mr-3 transition-transform duration-200 ${pathname !== '/dashboard/top-sales' ? 'group-hover:scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/dashboard/top-sales' ? 2.5 : 2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Top Sales
        </Link>
        <Link 
          href={`/dashboard/bundling${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
          className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
            pathname === '/dashboard/bundling' 
              ? 'text-amber-700 bg-amber-50/80 shadow-sm ring-1 ring-amber-100/50' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className={`w-5 h-5 mr-3 transition-transform duration-200 ${pathname !== '/dashboard/bundling' ? 'group-hover:scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/dashboard/bundling' ? 2.5 : 2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Bundling
        </Link>
        {pathname.startsWith('/dashboard/bundling') && (
          <div className="pl-6 pt-1 flex flex-col space-y-1">
            <Link
              href={`/dashboard/bundling/produk${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                pathname === '/dashboard/bundling/produk'
                  ? 'text-amber-700 bg-amber-50/80 shadow-sm ring-1 ring-amber-100/50'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>Produk</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${pathname !== '/dashboard/bundling/produk' ? 'group-hover:translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </Link>
            <Link
              href={`/dashboard/bundling/analysis${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                pathname === '/dashboard/bundling/analysis'
                  ? 'text-amber-700 bg-amber-50/80 shadow-sm ring-1 ring-amber-100/50'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>Analysis</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${pathname !== '/dashboard/bundling/analysis' ? 'group-hover:translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Link>
          </div>
        )}
      </nav>
      <div className="p-4 border-t border-gray-50">
         <Link href="/" className="flex items-center px-3.5 py-3 text-sm text-gray-500 rounded-xl hover:bg-gray-50 hover:text-gray-900 font-medium transition-all duration-200 group">
          <svg className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<aside className="w-56 bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex z-10 transition-all duration-300"></aside>}>
      <SidebarContent />
    </Suspense>
  );
}