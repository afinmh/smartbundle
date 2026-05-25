"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { Bar, Line } from 'react-chartjs-2';

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

const getPlaceholderImage = () => {
  if (typeof window === 'undefined') return null;
  const img = new Image();
  // Using placehold.co to create a nice round icon
  img.src = '/img/image.png';
  return img;
};
let placeholderImg: HTMLImageElement | null = null;
if (typeof window !== 'undefined') {
  placeholderImg = getPlaceholderImage();
}

const imagePlugin = {
  id: 'customImageOnBars',
  afterDatasetsDraw(chart: any) {
    if (!placeholderImg || !placeholderImg.complete) {
      if (placeholderImg && !placeholderImg.onload) {
        placeholderImg.onload = () => chart.update();
      }
      return;
    }
    const { ctx } = chart;
    const imgSize = 48; // Increased size from 32 to 48
    chart.data.datasets.forEach((dataset: any, i: number) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((element: any, index: number) => {
        const dataVal = dataset.data[index];
        if (dataVal > 0) {
          const x = element.x;
          const y = element.y;
          
          // Draw image
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y - imgSize/2 - 16, imgSize/2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(placeholderImg, x - imgSize/2, y - imgSize - 16, imgSize, imgSize);
          ctx.restore();

          // Draw ring around image
          ctx.beginPath();
          ctx.arc(x, y - imgSize/2 - 16, imgSize/2, 0, Math.PI * 2);
          ctx.lineWidth = 4;
          ctx.strokeStyle = dataset.backgroundColor;
          ctx.stroke();
        }
      });
    });
  }
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const selectedYearsParam = searchParams.get('years') || '2025,2026';
  const [summaryData, setSummaryData] = useState<any>(null);
  const [chartData, setChartData] = useState<{ [year: string]: any }>({});
  const [topProductsData, setTopProductsData] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<{lama: any, baru: any}>({ lama: null, baru: null });
  const [chartMetric, setChartMetric] = useState<'profit' | 'transaksi' | 'pelanggan'>('profit');

  useEffect(() => {
    // We only care about Jan, Feb, Mar since that's all the data we have.
    const AVAILABLE_MONTHS = ['januari', 'februari', 'maret'];
    const monthsToFetch = AVAILABLE_MONTHS;
    
    const selectedYears = selectedYearsParam.split(',').filter(Boolean);

    // Fetch comparison data independently
    Promise.all([
      fetch('/output_summary/summary_lama.json').then(res => res.ok ? res.json() : null),
      fetch('/output_summary/summary_baru.json').then(res => res.ok ? res.json() : null)
    ]).then(([lama, baru]) => {
      setComparisonData({ lama, baru });
    });

    const newChartData: { [year: string]: any } = {};
    const fetchPromises: Promise<any>[] = [];

    selectedYears.forEach(year => {
      const filename = year === '2025' ? 'summary_lama.json' : 'summary_baru.json';
      const p = fetch(`/output_summary/${filename}`)
        .then(res => {
          if (!res.ok) return null;
          return res.json();
        })
        .then(data => {
          if (data) {
            newChartData[year] = data;
          }
        })
        .catch(() => null);
      fetchPromises.push(p);
    });

    Promise.all(fetchPromises).then(() => {
      setChartData(newChartData);

      // Process summary data from fetchPromises
      const aggregated = {
        total_profit: 0,
        total_transaksi: 0,
        total_pelanggan: 0,
        rata_rata_aov: 0,
      };
      let hasData = false;
      let totalAOV = 0;
      let aovCount = 0;

      selectedYears.forEach(year => {
        const yearData = newChartData[year];
        if (yearData) {
          monthsToFetch.forEach(month => {
            const d = yearData[month];
            if (d) {
              hasData = true;
              aggregated.total_profit += (d.total_profit || 0);
              aggregated.total_transaksi += (d.total_transaksi || 0);
              aggregated.total_pelanggan += (d.total_pelanggan || 0);
              if (d.rata_rata_aov) {
                totalAOV += d.rata_rata_aov;
                aovCount++;
              }
            }
          });
        }
      });

      if (hasData) {
        if (aovCount > 0) {
          aggregated.rata_rata_aov = totalAOV / aovCount;
        }
        setSummaryData(aggregated);
      } else {
        setSummaryData(null);
      }

    });

    // Fetch Top 3 Podium Products logic
    let topProductsUrl = '';
    if (selectedYears.includes('2025') && selectedYears.includes('2026')) {
      topProductsUrl = '/penjualan_summary/summary_produk_gabungan.json';
    } else if (selectedYears.includes('2026')) {
      topProductsUrl = '/penjualan_summary/summary_produk_baru.json';
    } else if (selectedYears.includes('2025')) {
      topProductsUrl = '/penjualan_summary/summary_produk_lama.json';
    }

    if (topProductsUrl) {
      fetch(topProductsUrl)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (!data) return;
          const months = ['januari', 'februari', 'maret'];
          const top3PerMonth: any = { januari: [], februari: [], maret: [] };
          months.forEach(month => {
            let combinedData: any[] = [];
            if (data.lama && data.baru) {
              const lamaData = data.lama[month] || [];
              const baruData = data.baru[month] || [];
              const map: any = {};
              [...lamaData, ...baruData].forEach(item => {
                const name = item['Nama Produk'];
                if (!map[name]) map[name] = { ...item };
                else {
                  map[name].total_penjualan += item.total_penjualan;
                  map[name].jumlah_terjual += item.jumlah_terjual;
                  map[name].jumlah_pesanan_unik += item.jumlah_pesanan_unik;
                }
              });
              combinedData = Object.values(map);
            } else {
              combinedData = data[month] || [];
            }
            combinedData.sort((a, b) => b.total_penjualan - a.total_penjualan);
            top3PerMonth[month] = combinedData.slice(0, 3);
          });
          setTopProductsData(top3PerMonth);
        })
        .catch(() => console.error(`Failed to fetch ${topProductsUrl}`));
    }
  }, [selectedYearsParam]);

  const totalPendapatan = summaryData ? summaryData.total_profit : 0;
  const totalTransaksi = summaryData ? summaryData.total_transaksi : 0;
  const totalPelanggan = summaryData ? summaryData.total_pelanggan : 0;

  const AVAILABLE_MONTHS = ['januari', 'februari', 'maret'];
  const MONTH_LABELS = ['Jan', 'Feb', 'Mar'];

  const datasets = Object.keys(chartData).map(year => {
    const is2025 = year === '2025';
    const color = is2025 ? '#3b82f6' : '#f59e0b';
    const bgColor = is2025 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)';
    
    const yearData = chartData[year] || {};
    
    // Convert data for the selected months only
    const actualData = AVAILABLE_MONTHS.map(month => {
      const d = yearData[month];
      if (!d) return null;
      if (chartMetric === 'transaksi') return d.total_transaksi;
      if (chartMetric === 'pelanggan') return d.total_pelanggan;
      return Number((d.total_profit / 1000).toFixed(2)); // plot what we have, skip what we don't
    });

    const metricLabel = chartMetric === 'transaksi' ? 'Transaksi' : chartMetric === 'pelanggan' ? 'Pelanggan' : 'Pendapatan (Juta Rp)';

    return {
      label: `${metricLabel} ${year}`,
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
    labels: MONTH_LABELS,
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

  // --- Calculate Podium Chart Data ---
  const podiumLabels = ['Top 2', 'Top 1', 'Top 3'];
  // Colors: Silver, Gold, Bronze
  const podiumColors = ['#94a3b8', '#fbbf24', '#b45309']; 
  const podiumHoverColors = ['#64748b', '#f59e0b', '#92400e'];
  const rankIndices = [1, 0, 2]; // index 1 is Top 2, index 0 is Top 1, index 2 is Top 3

  const podiumDatasets = rankIndices.map((rankIdx, dsIndex) => {
    return {
      label: podiumLabels[dsIndex],
      data: AVAILABLE_MONTHS.map(month => {
        const product = topProductsData?.[month]?.[rankIdx];
        return product ? Number((product.total_penjualan / 1000).toFixed(2)) : 0;
      }),
      productNames: AVAILABLE_MONTHS.map(month => {
        const product = topProductsData?.[month]?.[rankIdx];
        return product ? product['Nama Produk'] : 'Tidak ada data';
      }),
      backgroundColor: podiumColors[dsIndex],
      hoverBackgroundColor: podiumHoverColors[dsIndex],
      borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: 'bottom',
      barPercentage: 1.0,
      categoryPercentage: 0.8
    };
  });

  const podiumChartData: any = {
    labels: MONTH_LABELS,
    datasets: podiumDatasets
  };

  const podiumChartOptions: any = {
    layout: {
      padding: {
        top: 80 // space for the larger image
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { font: { family: "'Inter', sans-serif", weight: 'bold' }, usePointStyle: true, boxWidth: 8, padding: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: 16,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
        callbacks: {
          title: function(context: any) {
             return `${context[0].label} - ${context[0].dataset.label}`;
          },
          label: function(context: any) {
            const ds = context.dataset;
            const val = context.raw;
            const pName = ds.productNames[context.dataIndex];
            
            return [
               ` ${pName}`,
               ` Rp ${val.toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 1})} Jt`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#f3f4f6', drawBorder: false },
        border: { display: false },
        ticks: { color: '#6b7280', font: { size: 12, family: "'Inter', sans-serif" } }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#374151', font: { size: 13, weight: 'bold', family: "'Inter', sans-serif" } }
      }
    }
  };

  // --- Calculate Comparison Data ---
  let diffPendapatanPct = 0;
  let diffTransaksiPct = 0;
  let diffPelangganPct = 0;

  let diffPendapatanAbs = 0;
  let diffTransaksiAbs = 0;
  let diffPelangganAbs = 0;

  if (comparisonData.lama?.summary && comparisonData.baru?.summary) {
    const l = comparisonData.lama.summary;
    const b = comparisonData.baru.summary;
    
    diffPendapatanAbs = b.total_profit - l.total_profit;
    diffTransaksiAbs = b.total_transaksi - l.total_transaksi;
    diffPelangganAbs = b.total_pelanggan - l.total_pelanggan;

    diffPendapatanPct = l.total_profit ? (diffPendapatanAbs / l.total_profit) * 100 : 0;
    diffTransaksiPct = l.total_transaksi ? (diffTransaksiAbs / l.total_transaksi) * 100 : 0;
    diffPelangganPct = l.total_pelanggan ? (diffPelangganAbs / l.total_pelanggan) * 100 : 0;
  }

  const comparisonChartData = {
    labels: ['Pendapatan', 'Transaksi', 'Pelanggan'],
    datasets: [
      {
        label: 'Pertumbuhan (%)',
        data: [
          Number(diffPendapatanPct.toFixed(1)),
          Number(diffTransaksiPct.toFixed(1)),
          Number(diffPelangganPct.toFixed(1))
        ],
        absData: [
          diffPendapatanAbs,
          diffTransaksiAbs,
          diffPelangganAbs
        ],
        backgroundColor: [
          diffPendapatanPct >= 0 ? '#f59e0b' : '#ef4444',
          diffTransaksiPct >= 0 ? '#3b82f6' : '#ef4444',
          diffPelangganPct >= 0 ? '#ec4899' : '#ef4444'
        ],
        hoverBackgroundColor: [
          diffPendapatanPct >= 0 ? '#d97706' : '#dc2626',
          diffTransaksiPct >= 0 ? '#2563eb' : '#dc2626',
          diffPelangganPct >= 0 ? '#db2777' : '#dc2626'
        ],
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.7,
      }
    ]
  };

  const comparisonChartOptions: any = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: 16,
        titleFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
        bodyFont: { size: 14, family: "'Inter', sans-serif", weight: '500' },
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: function(context: any) {
            const valPct = context.raw;
            const ds = context.dataset;
            const absVal = ds.absData[context.dataIndex];
            
            let absStr = '';
            if (context.label === 'Pendapatan') {
                absStr = `${absVal > 0 ? '+' : ''}${(absVal/1000).toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 1})} Jt`;
            } else {
                absStr = `${absVal > 0 ? '+' : ''}${Math.round(absVal)}`;
            }
            
            return ` ${valPct > 0 ? '+' : ''}${valPct}% (${absStr})`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#f3f4f6', drawBorder: false },
        border: { display: false },
        ticks: { 
          color: '#6b7280', font: { size: 12, family: "'Inter', sans-serif" },
          callback: function(value: any) { return value + '%'; }
        }
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#374151', font: { size: 13, weight: 'bold', family: "'Inter', sans-serif" } }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1">
          Ringkasan performa penjualan untuk kuartal 1 tahun {selectedYearsParam.split(',').join(', ')}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 border border-white/30 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-sm font-semibold tracking-wide uppercase drop-shadow-sm mb-0.5">Total Pendapatan</h3>
                <p className="text-white/70 text-xs">Akumulasi Kuartal 1</p>
              </div>
              <div className="p-2.5 bg-white/20 text-white rounded-xl shadow-sm backdrop-blur-md border border-white/40">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black text-white leading-none tracking-tight drop-shadow-md">
                  <span className="text-xl opacity-80 mr-1">Rp</span>
                  {(totalPendapatan / 1000).toLocaleString('id-ID', {maximumFractionDigits:0})}
                  <span className="text-xl opacity-80 ml-1.5">Jt</span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-amber-100 bg-amber-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-400/30 backdrop-blur-md shadow-sm">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Kinerja Stabil
                </span>
                <span className="text-white/80 text-xs font-medium">Bulan Jan-Mar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-white/30 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-sm font-semibold tracking-wide uppercase drop-shadow-sm mb-0.5">Total Transaksi</h3>
                <p className="text-white/70 text-xs">Akumulasi Kuartal 1</p>
              </div>
              <div className="p-2.5 bg-white/20 text-white rounded-xl shadow-sm backdrop-blur-md border border-white/40">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black text-white leading-none tracking-tight drop-shadow-md">
                  {totalTransaksi.toLocaleString('id-ID')}
                  <span className="text-xl opacity-80 ml-1.5">Trx</span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-blue-100 bg-blue-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold border border-blue-400/30 backdrop-blur-md shadow-sm">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Kinerja Stabil
                </span>
                <span className="text-white/80 text-xs font-medium">Bulan Jan-Mar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-500/20 border border-white/30 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-1 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-sm font-semibold tracking-wide uppercase drop-shadow-sm mb-0.5">Total Pelanggan</h3>
                <p className="text-white/70 text-xs">Akumulasi Kuartal 1</p>
              </div>
              <div className="p-2.5 bg-white/20 text-white rounded-xl shadow-sm backdrop-blur-md border border-white/40">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black text-white leading-none tracking-tight drop-shadow-md">
                  {totalPelanggan.toLocaleString('id-ID')}
                  <span className="text-xl opacity-80 ml-1.5">Orang</span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-rose-100 bg-rose-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold border border-rose-400/30 backdrop-blur-md shadow-sm">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Kinerja Stabil
                </span>
                <span className="text-white/80 text-xs font-medium">Bulan Jan-Mar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {chartMetric === 'transaksi' ? 'Tren Transaksi' : chartMetric === 'pelanggan' ? 'Tren Pelanggan' : 'Tren Pendapatan'}
            </h2>
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button 
                onClick={() => setChartMetric('profit')}
                className={`text-xs font-medium px-2 py-1.5 rounded-md transition-colors ${chartMetric === 'profit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pendapatan
              </button>
              <button 
                onClick={() => setChartMetric('transaksi')}
                className={`text-xs font-medium px-2 py-1.5 rounded-md transition-colors ${chartMetric === 'transaksi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Transaksi
              </button>
              <button 
                onClick={() => setChartMetric('pelanggan')}
                className={`text-xs font-medium px-2 py-1.5 rounded-md transition-colors ${chartMetric === 'pelanggan' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pelanggan
              </button>
            </div>
          </div>
          <div className="h-72 w-full mt-2">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Pertumbuhan 2026 vs 2025</h2>
            <span className="text-xs font-bold text-amber-700 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 rounded-lg border border-amber-200/50 shadow-sm">Keseluruhan</span>
          </div>
          <div className="h-72 w-full mt-2">
            <Bar options={comparisonChartOptions} data={comparisonChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 lg:col-span-2 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300">
           <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Top 3 Produk Bulanan</h2>
             <Link href="/dashboard/top-sales" className="text-sm font-bold text-amber-600 hover:text-amber-700 px-4 py-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl transition-all hover:shadow-sm border border-amber-100/50">Lihat Semua</Link>
          </div>
          <div className="h-96 w-full mt-2">
            <Bar options={podiumChartOptions} data={podiumChartData} plugins={[imagePlugin]} />
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
