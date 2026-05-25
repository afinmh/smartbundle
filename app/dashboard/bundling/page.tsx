"use client";

import { useState, useEffect, Suspense } from 'react';

function BundlingContent() {
  const [bundlingData, setBundlingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/analysis/bundling.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setBundlingData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading || !bundlingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-amber-500 font-bold">Memuat Analisis Bundling...</div>
      </div>
    );
  }

  const totalTerjualBaru = bundlingData.total.terjual.baru;
  const selisihTerjual = bundlingData.total.terjual.selisih;
  const growthTerjual = (selisihTerjual / bundlingData.total.terjual.lama) * 100;

  const totalUtilityBaru = bundlingData.total.utility.baru;
  const selisihUtility = bundlingData.total.utility.selisih;
  const growthUtility = (selisihUtility / bundlingData.total.utility.lama) * 100;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Kinerja Bundling</h1>
        <p className="text-gray-500 mt-1">Komparasi dan analisis mendalam strategi paket penjualan sebelum dan sesudahnya.</p>
      </div>
      
      {/* Compact Glassmorphic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Utility / Pendapatan */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 border border-white/30 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-sm font-semibold tracking-wide uppercase drop-shadow-sm mb-0.5">Total Pendapatan Bundling</h3>
                <p className="text-white/70 text-xs">Periode Baru vs Lama</p>
              </div>
              <div className="p-2.5 bg-white/20 text-white rounded-xl shadow-sm backdrop-blur-md border border-white/40">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black text-white leading-none tracking-tight drop-shadow-md">
                  <span className="text-xl opacity-80 mr-1">Rp</span>
                  {(totalUtilityBaru / 1000000).toLocaleString('id-ID', {minimumFractionDigits: 1, maximumFractionDigits: 1})}
                  <span className="text-xl opacity-80 ml-1">Jt</span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-emerald-100 bg-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-400/30 backdrop-blur-md shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  {growthUtility.toFixed(1)}%
                </span>
                <span className="text-white/80 text-xs font-medium">Tumbuh Rp {(selisihUtility / 1000000).toLocaleString('id-ID', {minimumFractionDigits:1})} Jt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Terjual */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg shadow-indigo-500/20 border border-white/30 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-sm font-semibold tracking-wide uppercase drop-shadow-sm mb-0.5">Volume Penjualan Bundling</h3>
                <p className="text-white/70 text-xs">Total Barang Terjual</p>
              </div>
              <div className="p-2.5 bg-white/20 text-white rounded-xl shadow-sm backdrop-blur-md border border-white/40">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black text-white leading-none tracking-tight drop-shadow-md">
                  {totalTerjualBaru.toLocaleString('id-ID')}
                  <span className="text-xl opacity-80 ml-1.5">Barang</span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-emerald-100 bg-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-400/30 backdrop-blur-md shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  {growthTerjual.toFixed(1)}%
                </span>
                <span className="text-white/80 text-xs font-medium">Naik {selisihTerjual} barang terjual</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Bundle Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-4">Performa Individual Bundling</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bundlingData.data.map((item: any) => {
            const products = item.produk_bundling.split(' + ');
            
            // Calculate max values for the bar charts
            const maxTerjual = Math.max(item.terjual.lama, item.terjual.baru);
            const maxUtility = Math.max(item.utility.lama, item.utility.baru);

            return (
              <div key={item.no} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-24 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-2 relative">
                     <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-orange-50 opacity-50"></div>
                     <div className="flex z-20 w-full h-full relative items-center justify-center">
                       <img src={`/img/image.png`} alt="Item 1" className="w-10 h-10 object-contain absolute left-1 drop-shadow-sm" />
                       <img src={`/img/image.png`} alt="Item 2" className="w-10 h-10 object-contain absolute right-1 drop-shadow-sm" />
                     </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">Bundling {item.no}</h3>
                    <div className="text-sm text-gray-500 flex flex-col gap-1.5">
                      {products.map((prod: string, i: number) => (
                        <span key={i} className="flex items-start gap-2 leading-snug">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></div>
                          <span className="truncate" title={prod}>{prod}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 border-t border-gray-50 pt-5">
                  {/* Terjual Stats */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Barang Terjual</p>
                    
                    {/* Lama */}
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Lama</span>
                      <span className="font-semibold text-gray-600">{item.terjual.lama}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div className="bg-gray-300 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (item.terjual.lama / maxTerjual) * 100)}%` }}></div>
                    </div>

                    {/* Baru */}
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-600 font-medium">Baru</span>
                      <span className="font-bold text-amber-700">{item.terjual.baru}</span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (item.terjual.baru / maxTerjual) * 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Utility Stats */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pendapatan (Utility)</p>
                    
                    {/* Lama */}
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Lama</span>
                      <span className="font-semibold text-gray-600">Rp {(item.utility.lama / 1000).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div className="bg-gray-300 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (item.utility.lama / maxUtility) * 100)}%` }}></div>
                    </div>

                    {/* Baru */}
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-600 font-medium">Baru</span>
                      <span className="font-bold text-amber-700">Rp {(item.utility.baru / 1000).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (item.utility.baru / maxUtility) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Bundling() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BundlingContent />
    </Suspense>
  );
}