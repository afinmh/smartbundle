"use client";

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

export default function BundlingAnalysis() {
  const [bundlingData, setBundlingData] = useState<any>(null);
  const [produkData, setProdukData] = useState<any>(null);
  const [chartMetric, setChartMetric] = useState<'utility' | 'terjual'>('utility');

  useEffect(() => {
    Promise.all([
      fetch('/analysis/bundling.json').then(res => res.json()),
      fetch('/analysis/produk_bundling.json').then(res => res.json())
    ]).then(([bundling, produk]) => {
      setBundlingData(bundling);
      setProdukData(produk);
    }).catch(err => console.error("Error fetching analysis data:", err));
  }, []);

  if (!bundlingData || !produkData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Extract totals from both datasets
  const bTotal = bundlingData.total;
  const pTotal = produkData.total;

  const peningkatanTerjual = pTotal?.jumlah_terjual?.selisih || 0;
  const peningkatanUtility = pTotal?.utility?.selisih || 0;

  const kontribusiTerjual = bTotal?.terjual?.selisih && peningkatanTerjual 
    ? ((bTotal.terjual.selisih / peningkatanTerjual) * 100).toFixed(1) 
    : 0;

  const kontribusiUtility = bTotal?.utility?.selisih && peningkatanUtility 
    ? ((bTotal.utility.selisih / peningkatanUtility) * 100).toFixed(1) 
    : 0;

  // Prepare chart data
  const bundles = bundlingData.data || [];
  const labels = bundles.map((_: any, index: number) => `Bundle ${index + 1}`);
  const itemNames = bundles.map((b: any) => b.produk_bundling);
  
  const terjualLama = bundles.map((b: any) => b.terjual.lama);
  const terjualBaru = bundles.map((b: any) => b.terjual.baru);

  const utilityLama = bundles.map((b: any) => b.utility.lama);
  const utilityBaru = bundles.map((b: any) => b.utility.baru);

  // Custom tooltip handler for images
  const getOrCreateTooltip = (chart: any) => {
    let tooltipEl = document.body.querySelector('div.analysis-tooltip') as HTMLElement;

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'analysis-tooltip';
      tooltipEl.style.background = 'rgba(17, 24, 39, 0.95)';
      tooltipEl.style.borderRadius = '16px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = '1';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, -100%)';
      tooltipEl.style.marginTop = '-10px';
      tooltipEl.style.transition = 'all .1s ease';
      tooltipEl.style.padding = '12px';
      tooltipEl.style.zIndex = '9999';
      tooltipEl.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      tooltipEl.style.border = '1px solid rgba(255,255,255,0.1)';

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
      const dataPoint = tooltip.dataPoints[0];
      const idx = dataPoint.dataIndex;
      const val = dataPoint.raw;
      const dsLabel = dataPoint.dataset.label;
      const isUtility = chartMetric === 'utility';
      
      const products = itemNames[idx].split(' + ');

      let innerHtml = '<div style="min-width: 240px;">';
      innerHtml += `<div style="font-size: 12px; font-weight: bold; color: #9ca3af; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Bundle ${idx + 1}</div>`;
      
      // Images and Names container
      innerHtml += `<div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">`;
      products.forEach((prod: string) => {
        const imgUrl = `/img/produk/${prod}.png`;
        innerHtml += `<div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="position: relative; width: 40px; height: 40px; border-radius: 8px; background: white; padding: 2px; border: 1px solid #374151; flex-shrink: 0;">
            <img src="${imgUrl}" alt="" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" onerror="this.src='/img/image.png'" />
          </div>
          <div style="font-size: 11px; line-height: 1.3; color: #e5e7eb; white-space: normal;">${prod}</div>
        </div>`;
      });
      innerHtml += `</div>`;

      // Stats
      innerHtml += `<div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">`;
      innerHtml += `<div style="font-size: 11px; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${dsLabel}</div>`;
      
      if (isUtility) {
        innerHtml += `<div style="font-size: 16px; font-weight: 900; color: #34d399;">Rp ${val.toLocaleString('id-ID')}</div>`;
      } else {
        innerHtml += `<div style="font-size: 16px; font-weight: 900; color: #fbbf24;">${val.toLocaleString('id-ID')} Pcs</div>`;
      }
      
      innerHtml += `</div></div>`;

      tooltipEl.innerHTML = innerHtml;
    }

    const rect = chart.canvas.getBoundingClientRect();
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

  // Common chart options for a premium look
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: "'Inter', sans-serif", weight: '600' }, usePointStyle: true, boxWidth: 8, padding: 20 }
      },
      tooltip: {
        enabled: false, // Disable native tooltip
        external: externalTooltipHandler
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6', drawBorder: false },
        border: { display: false },
        ticks: { color: '#6b7280', font: { family: "'Inter', sans-serif" } }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#374151', font: { weight: 'bold', family: "'Inter', sans-serif" } }
      }
    }
  };

  const terjualChartData = {
    labels,
    datasets: [
      {
        label: 'Sebelum Bundling',
        data: terjualLama,
        backgroundColor: '#cbd5e1',
        hoverBackgroundColor: '#94a3b8',
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Sesudah Bundling',
        data: terjualBaru,
        backgroundColor: '#f59e0b',
        hoverBackgroundColor: '#d97706',
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  };

  const utilityChartData = {
    labels,
    datasets: [
      {
        label: 'Sebelum Bundling',
        data: utilityLama,
        backgroundColor: '#cbd5e1',
        hoverBackgroundColor: '#94a3b8',
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Sesudah Bundling',
        data: utilityBaru,
        backgroundColor: '#10b981',
        hoverBackgroundColor: '#059669',
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analisis Dampak Bundling</h1>
        <p className="text-gray-500 mt-1">
          Evaluasi komprehensif kontribusi strategi bundling terhadap performa 10 produk utama secara keseluruhan.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Card 1: Peningkatan Terjual Total */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1">Total Peningkatan Terjual</h3>
                <p className="text-gray-400 text-[10px]">Keseluruhan 10 Produk</p>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                +{peningkatanTerjual.toLocaleString('id-ID')}
                <span className="text-base text-gray-400 font-medium ml-1">Pcs</span>
              </p>
              <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Lonjakan Penjualan
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Peningkatan Profit Total */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1">Total Peningkatan Profit</h3>
                <p className="text-gray-400 text-[10px]">Keseluruhan 10 Produk</p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                <span className="text-lg text-gray-400 mr-1">Rp</span>
                {(peningkatanUtility / 1000000).toFixed(1)}
                <span className="text-lg text-gray-400 ml-1">Jt</span>
              </p>
              <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Optimalisasi Laba
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Kontribusi Penjualan Bundling */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-xs font-bold tracking-wider uppercase mb-1 drop-shadow-sm">Kontribusi Bundling</h3>
                <p className="text-white/70 text-[10px]">Terhadap Penjualan Total</p>
              </div>
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black drop-shadow-md">
                  {kontribusiTerjual}%
                </p>
              </div>
              <div className="w-full bg-black/10 rounded-full h-1.5 mb-1 backdrop-blur-sm">
                <div className="bg-white h-1.5 rounded-full" style={{ width: `${kontribusiTerjual}%` }}></div>
              </div>
              <p className="text-[10px] text-white/80 font-medium mt-2">{bTotal?.terjual?.selisih} Pcs berasal dari paket bundling</p>
            </div>
          </div>
        </div>

        {/* Card 4: Kontribusi Profit Bundling */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-xs font-bold tracking-wider uppercase mb-1 drop-shadow-sm">Kontribusi Bundling</h3>
                <p className="text-white/70 text-[10px]">Terhadap Profit Total</p>
              </div>
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-4xl font-black drop-shadow-md">
                  {kontribusiUtility}%
                </p>
              </div>
              <div className="w-full bg-black/10 rounded-full h-1.5 mb-1 backdrop-blur-sm">
                <div className="bg-white h-1.5 rounded-full" style={{ width: `${kontribusiUtility}%` }}></div>
              </div>
              <p className="text-[10px] text-white/80 font-medium mt-2">Menyumbang Rp {(bTotal?.utility?.selisih / 1000000).toFixed(1)} Jt dari peningkatan</p>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Performa Paket Bundling</h2>
              <p className="text-xs font-medium text-gray-500 mt-1">Perbandingan performa tiap paket (Sebelum vs Sesudah)</p>
            </div>
            
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button
                onClick={() => setChartMetric('utility')}
                className={`text-xs font-medium px-4 py-2 rounded-md transition-all ${chartMetric === 'utility' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Profit
              </button>
              <button
                onClick={() => setChartMetric('terjual')}
                className={`text-xs font-medium px-4 py-2 rounded-md transition-all ${chartMetric === 'terjual' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Terjual
              </button>
            </div>
          </div>
          <div className="h-96 w-full relative">
            <Bar id="unifiedChart" data={chartMetric === 'utility' ? utilityChartData : terjualChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
