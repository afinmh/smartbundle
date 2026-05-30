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

import gambarMapping from '../../public/penjualan_summary/gambar.json';
const validProductNames = new Set(gambarMapping.map((item: any) => item['Nama Produk']));

const imageCache: { [key: string]: HTMLImageElement } = {};

const getProductImage = (productName: string) => {
  if (typeof window === 'undefined') return null;
  if (!productName || productName === 'Tidak ada data') return null;
  if (!validProductNames.has(productName)) return null;

  if (imageCache[productName]) return imageCache[productName];

  const img = new Image();
  img.src = `/img/produk/${productName}.png`;
  imageCache[productName] = img;
  return img;
};

const imagePlugin = {
  id: 'customImageOnBars',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;
    const imgSize = 48;

    chart.data.datasets.forEach((dataset: any, i: number) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((element: any, index: number) => {
        const dataVal = dataset.data[index];
        const productName = dataset.productNames ? dataset.productNames[index] : null;

        if (dataVal > 0 && productName) {
          const img = getProductImage(productName);
          if (img) {
            const x = element.x;
            const y = element.y;

            if (!img.complete) {
              if (!img.onload) {
                img.onload = () => chart.update();
              }
            } else if (img.naturalWidth > 0) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(x, y - imgSize / 2 - 16, imgSize / 2, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(img, x - imgSize / 2, y - imgSize - 16, imgSize, imgSize);
              ctx.restore();

              ctx.beginPath();
              ctx.arc(x, y - imgSize / 2 - 16, imgSize / 2, 0, Math.PI * 2);
              ctx.lineWidth = 4;
              ctx.strokeStyle = dataset.backgroundColor;
              ctx.stroke();
            }
          }
        }
      });
    });
  }
};

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = document.body.querySelector('div.chartjs-tooltip-custom') as HTMLElement;

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chartjs-tooltip-custom';
    tooltipEl.style.background = 'rgba(17, 24, 39, 0.95)';
    tooltipEl.style.borderRadius = '8px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = '1';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, -100%)';
    tooltipEl.style.marginTop = '-10px'; // Offset above the point
    tooltipEl.style.transition = 'all .1s ease';
    tooltipEl.style.padding = '8px 12px'; // slightly smaller padding
    tooltipEl.style.zIndex = '9999';
    tooltipEl.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';

    document.body.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context: any) => {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const dataPoint = tooltip.dataPoints[0];
    const ds = dataPoint.dataset;
    const pName = ds.productNames[dataPoint.dataIndex];
    const val = dataPoint.raw;
    const imgUrl = `/img/produk/${pName}.png`;

    let innerHtml = '<div>';
    innerHtml += `<div style="font-size: 11px; margin-bottom: 6px; font-weight: bold; color: #9ca3af;">${titleLines[0]} - ${ds.label}</div>`;
    innerHtml += `<div style="display: flex; align-items: center; gap: 10px;">`;

    if (pName !== 'Tidak ada data' && validProductNames.has(pName)) {
      innerHtml += `<img src="${imgUrl}" alt="" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 2px solid ${ds.backgroundColor}" onerror="this.style.display='none'" />`;
    }

    innerHtml += `<div>`;
    innerHtml += `<div style="font-weight: bold; font-size: 12px; max-width: 150px; white-space: normal; line-height: 1.3;">${pName}</div>`;
    innerHtml += `<div style="color: ${ds.backgroundColor}; font-weight: bold; margin-top: 4px; font-size: 12px;">Rp ${val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} Jt</div>`;
    innerHtml += `</div></div></div>`;

    tooltipEl.innerHTML = innerHtml;
  }

  const rect = chart.canvas.getBoundingClientRect();

  // Dynamic positioning to prevent overflow
  const chartWidth = chart.width;
  let transformX = '-50%';

  if (tooltip.caretX > chartWidth * 0.7) {
    transformX = '-100%';
  } else if (tooltip.caretX < chartWidth * 0.3) {
    transformX = '0%';
  }

  tooltipEl.style.transform = `translate(${transformX}, -100%)`;
  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = rect.left + window.scrollX + tooltip.caretX + 'px';
  tooltipEl.style.top = rect.top + window.scrollY + tooltip.caretY + 'px';
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const selectedYear = searchParams.get('years') || '2026';
  
  const [chartData, setChartData] = useState<{ [year: string]: any }>({});
  const [topProductsData, setTopProductsData] = useState<any>(null);
  const [chartMetric, setChartMetric] = useState<'profit' | 'transaksi' | 'terjual'>('profit');
  const [lineChartYears, setLineChartYears] = useState<string[]>([selectedYear]);
  const [pieChartMetric, setPieChartMetric] = useState<'profit' | 'transaksi' | 'terjual'>('transaksi');

  // Update lineChartYears when global selectedYear changes (optional)
  useEffect(() => {
    setLineChartYears([selectedYear]);
  }, [selectedYear]);

  const handleYearDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'both') {
      setLineChartYears(['2025', '2026']);
    } else {
      setLineChartYears([val]);
    }
  };

  useEffect(() => {
    // We only care about Jan, Feb, Mar since that's all the data we have.
    const AVAILABLE_MONTHS = ['januari', 'februari', 'maret'];

    const newChartData: { [year: string]: any } = {};
    const fetchPromises: Promise<any>[] = [];

    ['2025', '2026'].forEach(year => {
      const p = fetch(`/analysis/summary_${year}.json`)
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
    });

    // Fetch Top 3 Podium Products logic
    let topProductsUrl = '';
    if (selectedYear === '2026') {
      topProductsUrl = '/penjualan_summary/summary_produk_baru.json';
    } else {
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
            let combinedData: any[] = data[month] || [];
            combinedData.sort((a, b) => b.total_penjualan - a.total_penjualan);
            top3PerMonth[month] = combinedData.slice(0, 3);
          });
          setTopProductsData(top3PerMonth);
        })
        .catch(() => console.error(`Failed to fetch ${topProductsUrl}`));
    }
  }, [selectedYear]);

  const currentYearData = chartData[selectedYear];
  const summaryData = currentYearData ? currentYearData.total : null;
  const singleVsMulti = currentYearData ? currentYearData.single_vs_multi : null;

  const totalPendapatan = summaryData ? summaryData.total_pendapatan : 0;
  const totalTransaksi = summaryData ? summaryData.total_transaksi : 0;
  const totalTerjual = summaryData ? summaryData.total_terjual : 0;

  const sp = singleVsMulti ? singleVsMulti.single_produk : null;
  const mp = singleVsMulti ? singleVsMulti.multi_produk : null;

  const isSingleDominant = sp && mp ? sp.jumlah_transaksi >= mp.jumlah_transaksi : true;
  const dominantName = isSingleDominant ? 'Single Item' : 'Multi Item';
  const dominantPct = isSingleDominant && sp ? sp.persentase : (mp ? mp.persentase : 0);

  const AVAILABLE_MONTHS = ['januari', 'februari', 'maret'];
  const MONTH_LABELS = ['Jan', 'Feb', 'Mar'];

  const datasets = lineChartYears.map(year => {
    const is2025 = year === '2025';
    const color = is2025 ? '#3b82f6' : '#f59e0b';
    const bgColor = is2025 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)';

    const yearData = chartData[year] || {};

    // Convert data for the selected months only
    const actualData = AVAILABLE_MONTHS.map(month => {
      const d = yearData[month];
      if (!d) return null;
      if (chartMetric === 'transaksi') return d.total_transaksi;
      if (chartMetric === 'terjual') return d.total_terjual;
      return Number((d.total_pendapatan / 1000).toFixed(2));
    });

    const metricLabel = chartMetric === 'transaksi' ? 'Transaksi' : chartMetric === 'terjual' ? 'Terjual (Barang)' : 'Pendapatan (Juta Rp)';

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
        enabled: false,
        external: externalTooltipHandler
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

  const pieDataValues = pieChartMetric === 'profit' 
    ? [sp ? sp.total_pendapatan / 1000 : 0, mp ? mp.total_pendapatan / 1000 : 0]
    : pieChartMetric === 'terjual'
    ? [sp ? sp.total_terjual : 0, mp ? mp.total_terjual : 0]
    : [sp ? sp.jumlah_transaksi : 0, mp ? mp.jumlah_transaksi : 0];

  const pieChartData = {
    labels: ['Single Item', 'Multi Item'],
    datasets: [
      {
        data: pieDataValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.85)', // Blue
          'rgba(245, 158, 11, 0.85)'  // Amber
        ],
        hoverBackgroundColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(217, 119, 6, 1)'
        ],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 3,
        hoverOffset: 8
      }
    ]
  };

  const pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // makes it a doughnut
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 20, usePointStyle: true, font: { family: "'Inter', sans-serif", weight: 'bold' } }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: 12,
        titleFont: { size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const val = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
            
            if (pieChartMetric === 'profit') {
                 return ` Rp ${val.toLocaleString('id-ID', { maximumFractionDigits: 0 })} Jt (${pct}%)`;
            } else if (pieChartMetric === 'terjual') {
                 return ` ${val.toLocaleString('id-ID')} Item (${pct}%)`;
            } else {
                 return ` ${val.toLocaleString('id-ID')} Trx (${pct}%)`;
            }
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">
            Ringkasan performa penjualan untuk kuartal 1 tahun {selectedYear}.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pendapatan */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-white shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-gray-500 text-[11px] font-bold tracking-wider uppercase mb-0.5">Total Pendapatan</h3>
                <p className="text-gray-400 text-[9px]">Keseluruhan</p>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-end gap-1 mb-2">
                <p className="text-2xl font-black text-gray-900 mb-0 leading-none">
                  <span className="text-sm text-gray-400 mr-1">Rp</span>
                  {(totalPendapatan / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                  <span className="text-xs text-gray-400 ml-1.5">Jt</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-50 text-[10px] sm:text-[11px] font-medium">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Single:</span>
                  <span className="text-gray-700">Rp {(sp ? sp.total_pendapatan / 1000 : 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Jt</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Multi:</span>
                  <span className="text-gray-700">Rp {(mp ? mp.total_pendapatan / 1000 : 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Jt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Transaksi */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-white shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-gray-500 text-[11px] font-bold tracking-wider uppercase mb-0.5">Total Transaksi</h3>
                <p className="text-gray-400 text-[9px]">Keseluruhan</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-end gap-1 mb-2">
                <p className="text-2xl font-black text-gray-900 mb-0 leading-none">
                  {totalTransaksi.toLocaleString('id-ID')}
                  <span className="text-xs text-gray-400 font-semibold ml-1.5">Trx</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-50 text-[10px] sm:text-[11px] font-medium">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Single:</span>
                  <span className="text-gray-700">{(sp ? sp.jumlah_transaksi : 0).toLocaleString('id-ID')} Trx</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Multi:</span>
                  <span className="text-gray-700">{(mp ? mp.jumlah_transaksi : 0).toLocaleString('id-ID')} Trx</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Penjualan Terbanyak */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md shadow-rose-500/20 border border-rose-300 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/30 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-white/95 text-[11px] font-bold tracking-wider uppercase drop-shadow-sm mb-0.5">Penjualan Terbanyak</h3>
                <p className="text-white/70 text-[9px]">Kategori Item</p>
              </div>
              <div className="p-2 bg-white/20 text-white rounded-xl shadow-sm backdrop-blur-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-end gap-1 mb-2">
                <p className="text-2xl font-black text-white leading-none tracking-tight drop-shadow-md pb-0.5">
                  {dominantName}
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-white/20 text-[10px] sm:text-[11px] font-medium text-rose-50 w-full">
                <div className="flex justify-between items-center rounded-lg backdrop-blur-sm">
                  <span className="text-white/80">Single:</span>
                  <span className="font-bold">{sp ? sp.persentase : 0}%</span>
                </div>
                <div className="flex justify-between items-center rounded-lg backdrop-blur-sm">
                  <span className="text-white/80">Multi:</span>
                  <span className="font-bold">{mp ? mp.persentase : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Total Terjual */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/20 border border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/30 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-white/95 text-[11px] font-bold tracking-wider uppercase drop-shadow-sm mb-0.5">Total Terjual</h3>
                <p className="text-white/70 text-[9px]">Keseluruhan</p>
              </div>
              <div className="p-2 bg-white/20 text-white rounded-xl shadow-sm backdrop-blur-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-end gap-1 mb-2">
                <p className="text-2xl font-black text-white leading-none tracking-tight drop-shadow-md pb-0.5">
                  {totalTerjual.toLocaleString('id-ID')}
                  <span className="text-xs opacity-80 ml-1.5 font-semibold">Item</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-white/20 text-[10px] sm:text-[11px] font-medium text-emerald-50 w-full">
                <div className="flex justify-between items-center rounded-lg backdrop-blur-sm">
                  <span className="text-white/80">Single:</span>
                  <span className="font-bold">{(sp ? sp.total_terjual : 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center rounded-lg backdrop-blur-sm">
                  <span className="text-white/80">Multi:</span>
                  <span className="font-bold">{(mp ? mp.total_terjual : 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {chartMetric === 'transaksi' ? 'Tren Transaksi' : chartMetric === 'terjual' ? 'Tren Terjual' : 'Tren Pendapatan'}
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={lineChartYears.length === 2 ? 'both' : lineChartYears[0]}
                onChange={handleYearDropdownChange}
                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="2026">Tahun 2026</option>
                <option value="2025">Tahun 2025</option>
                <option value="both">Bandingkan 25 & 26</option>
              </select>

              <select
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value as 'profit' | 'transaksi' | 'terjual')}
                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="profit">Pendapatan</option>
                <option value="transaksi">Transaksi</option>
                <option value="terjual">Terjual</option>
              </select>
            </div>
          </div>
          <div className="h-72 w-full mt-2">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {pieChartMetric === 'transaksi' ? 'Persentase Transaksi' : pieChartMetric === 'terjual' ? 'Persentase Terjual' : 'Persentase Pendapatan'}
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={pieChartMetric}
                onChange={(e) => setPieChartMetric(e.target.value as 'profit' | 'transaksi' | 'terjual')}
                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="profit">Pendapatan</option>
                <option value="transaksi">Transaksi</option>
                <option value="terjual">Terjual</option>
              </select>
            </div>
          </div>
          <div className="h-72 w-full mt-2 relative flex justify-center items-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-[-20px]">
              <span className="text-3xl font-black text-gray-800">
                {pieChartMetric === 'profit' 
                  ? `Rp ${(totalPendapatan / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}` 
                  : pieChartMetric === 'terjual'
                  ? totalTerjual.toLocaleString('id-ID')
                  : totalTransaksi.toLocaleString('id-ID')}
                {pieChartMetric === 'profit' && <span className="text-xl ml-1 text-gray-600">Jt</span>}
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
                {pieChartMetric === 'profit' ? 'Total Pendapatan' : pieChartMetric === 'terjual' ? 'Total Terjual' : 'Total Trx'}
              </span>
            </div>
            <Doughnut options={pieChartOptions} data={pieChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 lg:col-span-2 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Top 3 Produk Bulanan</h2>
            <Link href="/dashboard/top-sales" className="text-sm font-bold text-amber-600 hover:text-amber-700 px-4 py-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl transition-all hover:shadow-sm border border-amber-100/50">Lihat Semua</Link>
          </div>
          <div className="relative h-96 w-full mt-2">
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
