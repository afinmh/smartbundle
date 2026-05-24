"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

function DashboardContent() {
  const searchParams = useSearchParams();
  const selectedYearsParam = searchParams.get('years') || '2025,2026';
  const selectedMonthsParam = searchParams.get('months') || 'januari,februari,maret';
  const [summaryData, setSummaryData] = useState<any>(null);
  const [chartData, setChartData] = useState<{ [year: string]: any[] }>({});
  const [topProductsData, setTopProductsData] = useState<any>(null);

  useEffect(() => {
    // We only care about Jan, Feb, Mar since that's all the data we have.
    const AVAILABLE_MONTHS = ['januari', 'februari', 'maret'];
    
    const selectedYears = selectedYearsParam.split(',').filter(Boolean);
    const selectedMonths = selectedMonthsParam.split(',').filter(Boolean);
    
    // Only try to fetch months that actually exist in our available dataset
    // AND were selected by the user.
    const monthsToFetch = selectedMonths.filter(m => AVAILABLE_MONTHS.includes(m));

    const newChartData: { [year: string]: any[] } = {};
    const fetchPromises: Promise<any>[] = [];
    const salesPromises: Promise<{ year: string, month: string, data: any[] }>[] = [];

    // Fetch ONLY the required months instead of blindly doing 12 fetches per year.
    selectedYears.forEach(year => {
      newChartData[year] = new Array(3).fill(null); // Array of size 3 for Jan, Feb, Mar
      
      AVAILABLE_MONTHS.forEach((month, index) => {
         // Even if the user selected 'Maret', we only fetch it if it's in the selected list
         // We still allocate space for all 3 available months so the X-axis aligns correctly.
         if (monthsToFetch.includes(month)) {
            const filename = year === '2025' ? `${month}.json` : `${month}_${year}.json`;
            const p = fetch(`/output_summary/${filename}`)
              .then(res => {
                if (!res.ok) return null;
                return res.json();
              })
              .then(data => {
                if (data && data.length > 0) {
                  newChartData[year][index] = data[0];
                }
              })
              .catch(() => null);
            fetchPromises.push(p);

            // Fetch product sales data for top 5 products chart
            const sp = fetch(`/penjualan_summary/${filename}`)
              .then(res => {
                if (!res.ok) return [];
                return res.json();
              })
              .then(data => {
                return { year, month, data };
              })
              .catch(() => ({ year, month, data: [] }));
            salesPromises.push(sp);
         }
      });
    });

    Promise.all([...fetchPromises, ...salesPromises]).then((results) => {
      setChartData(newChartData);

      // Process summary data from fetchPromises
      const aggregated = {
        total_profit: 0,
        total_transaksi: 0,
        total_pelanggan: 0,
        total_beli_1_barang: 0,
        total_beli_lebih_dari_1_barang: 0
      };
      let hasData = false;

      selectedYears.forEach(year => {
        monthsToFetch.forEach(month => {
          const mIndex = AVAILABLE_MONTHS.indexOf(month);
          const d = newChartData[year][mIndex];
          if (d) {
            hasData = true;
            aggregated.total_profit += (d.total_profit || 0);
            aggregated.total_transaksi += (d.total_transaksi || 0);
            aggregated.total_pelanggan += (d.total_pelanggan || 0);
            aggregated.total_beli_1_barang += (d.total_beli_1_barang || 0);
            aggregated.total_beli_lebih_dari_1_barang += (d.total_beli_lebih_dari_1_barang || 0);
          }
        });
      });

      if (hasData) {
        setSummaryData(aggregated);
      } else {
        setSummaryData(null);
      }

      // Process top products data from salesPromises
      // We extract only sales promises results which are objects with { year, month, data }
      const salesResults = results.filter(r => r && r.hasOwnProperty('year')) as { year: string, month: string, data: any[] }[];
      
      const productTotals: { [key: string]: number } = {};
      const productMonthlyData: { [key: string]: { [month: string]: number } } = {};

      salesResults.forEach(({ month, data }) => {
         data.forEach((item: any) => {
            const name = item['Nama Produk'];
            const revenue = item.total_penjualan || 0;
            productTotals[name] = (productTotals[name] || 0) + revenue;

            if (!productMonthlyData[name]) productMonthlyData[name] = {};
            productMonthlyData[name][month] = (productMonthlyData[name][month] || 0) + revenue;
         });
      });

      // Find top 5 products overall
      const top5 = Object.keys(productTotals)
         .sort((a, b) => productTotals[b] - productTotals[a])
         .slice(0, 5);

      if (top5.length > 0) {
         setTopProductsData({ top5, productMonthlyData });
      } else {
         setTopProductsData(null);
      }
    });

  }, [selectedYearsParam, selectedMonthsParam]);

  const totalPendapatan = summaryData ? summaryData.total_profit : 720000;
  const totalTransaksi = summaryData ? summaryData.total_transaksi : 8450;
  const totalPelanggan = summaryData ? summaryData.total_pelanggan : 3240;
  
  const bundlingSales = summaryData ? summaryData.total_beli_lebih_dari_1_barang : 68;
  const satuanSales = summaryData ? summaryData.total_beli_1_barang : 32;
  const totalSales = bundlingSales + satuanSales;
  const bundlingRatio = totalSales > 0 ? Math.round((bundlingSales / totalSales) * 100) : 68;

  const AVAILABLE_MONTHS = ['januari', 'februari', 'maret'];
  const MONTH_LABELS = ['Jan', 'Feb', 'Mar'];

  const sortedSelectedMonths = selectedMonthsParam.split(',').filter(Boolean).sort((a, b) => AVAILABLE_MONTHS.indexOf(a) - AVAILABLE_MONTHS.indexOf(b));

  const datasets = Object.keys(chartData).map(year => {
    const is2025 = year === '2025';
    const color = is2025 ? '#3b82f6' : '#f59e0b';
    const bgColor = is2025 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)';
    
    const yearData = chartData[year] || [];
    
    // Convert data for the selected months only
    const actualData = sortedSelectedMonths.map(month => {
      const idx = AVAILABLE_MONTHS.indexOf(month);
      const d = yearData[idx];
      return d ? Number((d.total_profit / 1000).toFixed(2)) : null; // plot what we have, skip what we don't
    });

    return {
      label: `Pendapatan ${year} (Juta Rp)`,
      data: actualData,
      borderColor: color,
      backgroundColor: bgColor,
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: color,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      spanGaps: true, // Enable lines between missing months
    };
  });

  const lineChartData = {
    labels: sortedSelectedMonths.map(m => MONTH_LABELS[AVAILABLE_MONTHS.indexOf(m)]),
    datasets: datasets
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: Object.keys(chartData).length > 1, // Display legend if multiple years selected
        position: 'top' as const,
        align: 'end' as const,
        labels: {
           usePointStyle: true,
           boxWidth: 8,
           font: { family: "'Inter', sans-serif", size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 14, weight: 'bold' as const },
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        border: { display: false }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        border: { display: false }
      },
    },
  };

  const topProductsChartColors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
  const barChartData = {
    labels: sortedSelectedMonths.map(m => MONTH_LABELS[AVAILABLE_MONTHS.indexOf(m)]),
    datasets: topProductsData ? topProductsData.top5.map((productName: string, index: number) => {
      // Data per month for this product
      const data = sortedSelectedMonths.map(month => {
        const val = topProductsData.productMonthlyData[productName]?.[month] || 0;
        return Number((val / 1000).toFixed(2));
      });
      return {
        label: productName,
        data: data,
        backgroundColor: topProductsChartColors[index],
        borderRadius: 6,
        barThickness: 16,
      };
    }) : [],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // hide legend so it doesn't clutter, since name is shown on hover tooltip
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: Rp ${context.raw} Jt`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        border: { display: false }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        border: { display: false }
      },
    },
  };

  const doughnutData = {
    labels: ['Penjualan Bundling', 'Penjualan Satuan'],
    datasets: [
      {
        data: [bundlingSales, satuanSales],
        backgroundColor: ['#f59e0b', '#f3f4f6'],
        hoverBackgroundColor: ['#d97706', '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '75%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1">
          Ringkasan performa penjualan dan strategi bundling untuk {selectedMonthsParam.split(',').join(', ')} {selectedYearsParam.split(',').join(', ')}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Pendapatan</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 leading-none">Rp {(totalPendapatan / 1000).toFixed(0)} Jt</p>
          <span className="text-green-500 text-sm font-semibold flex items-center mt-3">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            12.5% <span className="text-gray-400 ml-1.5 font-normal">dari bulan lalu</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Transaksi</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 leading-none">{totalTransaksi.toLocaleString('id-ID')}</p>
          <span className="text-green-500 text-sm font-semibold flex items-center mt-3">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            8.2% <span className="text-gray-400 ml-1.5 font-normal">dari bulan lalu</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Konversi Bundling</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 leading-none">{bundlingRatio}%</p>
          <span className="text-green-500 text-sm font-semibold flex items-center mt-3">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            5.0% <span className="text-gray-400 ml-1.5 font-normal">dari bulan lalu</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Pelanggan</h3>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 leading-none">{totalPelanggan.toLocaleString('id-ID')}</p>
          <span className="text-gray-500 text-sm font-semibold flex items-center mt-3">
            -- <span className="text-gray-400 ml-1.5 font-normal">relatif stabil</span>
          </span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Tren Pendapatan Tahun Ini</h2>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1 bg-gray-50 rounded-lg">Tahun {selectedYearsParam}</button>
          </div>
          <div className="h-72 w-full">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-800 mb-6 w-full text-center">Rasio Penjualan</h2>
          <div className="h-44 relative w-full flex justify-center items-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-3xl font-black text-gray-900">{bundlingRatio}%</span>
              <span className="text-xs text-gray-500 font-medium">Bundling</span>
            </div>
            <div className="h-full w-full">
               <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-amber-500"></span>
              <span className="text-sm text-gray-600 font-medium">Penjualan Bundling</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-gray-100"></span>
              <span className="text-sm text-gray-600 font-medium">Penjualan Satuan</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-3">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Top 5 Produk</h2>
             <button className="text-sm font-medium text-amber-600 hover:text-amber-700 px-3 py-1 bg-amber-50 rounded-lg">Lihat Semua</button>
          </div>
          <div className="h-72 w-full">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 min-h-screen">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
