"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TopSalesContent() {
  const searchParams = useSearchParams();
  // default to all available years and months
  const selectedYearsParam = searchParams.get('years') || '2025,2026';
  const selectedMonthsParam = searchParams.get('months') || 'januari,februari,maret';

  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const AVAILABLE_MONTHS = ['januari', 'februari', 'maret'];
    
    const selectedYears = selectedYearsParam.split(',').filter(Boolean);
    const selectedMonths = selectedMonthsParam.split(',').filter(Boolean);
    
    let topProductsUrl = '';
    if (selectedYears.includes('2025') && selectedYears.includes('2026')) {
      topProductsUrl = '/penjualan_summary/summary_produk_gabungan.json';
    } else if (selectedYears.includes('2026')) {
      topProductsUrl = '/penjualan_summary/summary_produk_baru.json';
    } else if (selectedYears.includes('2025')) {
      topProductsUrl = '/penjualan_summary/summary_produk_lama.json';
    }

    if (topProductsUrl) {
      setIsLoading(true);
      fetch(topProductsUrl)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (!data) return;
          
          const productMap: { [key: string]: { name: string, sold: number, revenue: number } } = {};
          
          AVAILABLE_MONTHS.forEach(month => {
            let combinedData: any[] = [];
            if (data.lama && data.baru) {
              const lamaData = data.lama[month] || [];
              const baruData = data.baru[month] || [];
              combinedData = [...lamaData, ...baruData];
            } else {
              combinedData = data[month] || [];
            }
            
            combinedData.forEach(item => {
               const name = item['Nama Produk'];
               if (!productMap[name]) {
                 productMap[name] = { name, sold: 0, revenue: 0 };
               }
               productMap[name].sold += item.jumlah_terjual || 0;
               productMap[name].revenue += item.total_penjualan || 0;
            });
          });

          // Convert to array and sort by sold amount descending
          let aggregatedProducts = Object.values(productMap).sort((a, b) => b.sold - a.sold);
          
          setTopProducts(aggregatedProducts.slice(0, 50).map((prod, idx) => ({
            id: idx + 1,
            name: prod.name,
            sold: prod.sold,
            revenue: `Rp ${(prod.revenue / 1000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Jt`,
            trend: '+0%' // Placeholder since we don't have time-series trend yet
          })));
          setIsLoading(false);
          setCurrentPage(1);
        })
        .catch(() => {
          setIsLoading(false);
          setTopProducts([]);
        });
    }

  }, [selectedYearsParam, selectedMonthsParam]);

  const totalPages = Math.ceil(topProducts.length / itemsPerPage);
  const currentProducts = topProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Top Sales</h1>
        <p className="text-gray-500 mt-1">Daftar produk dan paket bundling terlaris untuk {selectedMonthsParam.split(',').join(', ')} {selectedYearsParam.split(',').join(', ')}.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Peringkat Penjualan</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Filter</button>
            <button className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Export</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Memuat data penjualan...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="py-4 px-6 font-semibold text-gray-500 text-sm border-b border-gray-100 w-24">Peringkat</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-sm border-b border-gray-100">Nama Produk/Bundling</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-sm border-b border-gray-100 w-48">Jumlah Terjual</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-sm border-b border-gray-100 w-48">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 divide-y divide-gray-50">
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        product.id === 1 ? 'bg-amber-100 text-amber-700' :
                        product.id === 2 ? 'bg-gray-200 text-gray-700' :
                        product.id === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        #{product.id}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900 border-r border-transparent">
                      {product.name}
                      {product.name.toLowerCase().includes('bundling') && (
                        <span className="ml-2 inline-block px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-md">Bundle</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold">{product.sold.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-400">pcs</span></td>
                    <td className="py-4 px-6 font-medium text-gray-600">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!isLoading && topProducts.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, topProducts.length)} dari total {topProducts.length} data</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TopSales() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 min-h-screen">Loading Top Sales...</div>}>
      <TopSalesContent />
    </Suspense>
  );
}
