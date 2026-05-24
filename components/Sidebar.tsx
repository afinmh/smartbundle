"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex z-10">
      <div className="h-20 flex items-center px-6 border-b border-gray-100 gap-3">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src="/img/logo.png"
            alt="SmartBundle Logo"
            fill
            className="object-contain"
          />
        </div>
        <Link href="/" className="text-2xl font-black text-gray-900 tracking-tight">
          Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Bundle</span>
        </Link>
      </div>
      <nav className="p-4 space-y-1.5 flex-1">
        <Link 
          href="/dashboard" 
          className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition-all hover:translate-x-1 ${
            pathname === '/dashboard' 
              ? 'text-amber-700 bg-amber-50 font-bold' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/dashboard' ? 2.5 : 2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Overview
        </Link>
        <Link 
          href="/dashboard/top-sales" 
          className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition-all hover:translate-x-1 ${
            pathname === '/dashboard/top-sales' 
              ? 'text-amber-700 bg-amber-50 font-bold' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/dashboard/top-sales' ? 2.5 : 2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Top Sales
        </Link>
        <Link 
          href="/dashboard/analytics" 
          className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition-all hover:translate-x-1 ${
            pathname === '/dashboard/analytics' 
              ? 'text-amber-700 bg-amber-50 font-bold' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/dashboard/analytics' ? 2.5 : 2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-100">
         <Link href="/" className="flex items-center px-4 py-3 text-gray-500 rounded-xl hover:bg-gray-100 hover:text-gray-900 font-medium transition-all">
          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </aside>
  );
}