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

export default function ProdukAnalysis() {
  const [produkData, setProdukData] = useState<any>(null);
  const [chartMetric, setChartMetric] = useState<'utility' | 'terjual'>('utility');

  useEffect(() => {
    fetch('/analysis/produk_bundling.json')
      .then(res => res.json())
      .then(data => {
        setProdukData(data);
      })
      .catch(err => console.error("Error fetching produk data:", err));
  }, []);

  if (!produkData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Extract totals
  const pTotal = produkData.total;
  const peningkatanTerjual = pTotal?.jumlah_terjual?.selisih || 0;
  const peningkatanUtility = pTotal?.utility?.selisih || 0;

  // Prepare chart data
  const products = produkData.data || [];
  const labels = products.map((_: any, index: number) => `Produk ${index + 1}`);
  const itemNames = products.map((b: any) => b.nama_produk);
  
  const terjualLama = products.map((b: any) => b.jumlah_terjual.lama);
  const terjualBaru = products.map((b: any) => b.jumlah_terjual.baru);

  const utilityLama = products.map((b: any) => b.utility.lama);
  const utilityBaru = products.map((b: any) => b.utility.baru);

  // Custom tooltip handler for images
  const getOrCreateTooltip = (chart: any) => {
    let tooltipEl = document.body.querySelector('div.produk-tooltip') as HTMLElement;

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'produk-tooltip';
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
      
      const prodName = itemNames[idx];

      let innerHtml = '<div style="min-width: 240px; max-width: 320px;">';
      innerHtml += `<div style="font-size: 12px; font-weight: bold; color: #9ca3af; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Produk ${idx + 1}</div>`;
      
      // Image and Name container
      const imgUrl = `/img/produk/${prodName}.png`;
      innerHtml += `<div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 16px;">
        <div style="position: relative; width: 48px; height: 48px; border-radius: 8px; background: white; padding: 2px; border: 1px solid #374151; flex-shrink: 0;">
          <img src="${imgUrl}" alt="" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" onerror="this.src='/img/image.png'" />
        </div>
        <div style="font-size: 12px; font-weight: 500; line-height: 1.4; color: #e5e7eb; white-space: normal;">${prodName}</div>
      </div>`;

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

    // Adjust tooltip placement dynamically based on position
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

  // Common chart options for a premium horizontal bar look
  const chartOptions: any = {
    indexAxis: 'y', // This makes it horizontal
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
      x: {
        beginAtZero: true,
        grid: { color: '#f3f4f6', drawBorder: false },
        border: { display: false },
        ticks: { color: '#6b7280', font: { family: "'Inter', sans-serif" } }
      },
      y: {
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
        borderRadius: { topLeft: 0, topRight: 6, bottomLeft: 0, bottomRight: 6 },
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Sesudah Bundling',
        data: terjualBaru,
        backgroundColor: '#f59e0b',
        hoverBackgroundColor: '#d97706',
        borderRadius: { topLeft: 0, topRight: 6, bottomLeft: 0, bottomRight: 6 },
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
        borderRadius: { topLeft: 0, topRight: 6, bottomLeft: 0, bottomRight: 6 },
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Sesudah Bundling',
        data: utilityBaru,
        backgroundColor: '#10b981',
        hoverBackgroundColor: '#059669',
        borderRadius: { topLeft: 0, topRight: 6, bottomLeft: 0, bottomRight: 6 },
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analisis 10 Produk Bundling</h1>
        <p className="text-gray-500 mt-1">
          Evaluasi performa individual masing-masing dari ke-10 produk yang dimasukkan ke dalam strategi bundling.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg shadow-indigo-500/20 border border-white/30 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/90 text-sm font-semibold tracking-wide uppercase drop-shadow-sm mb-0.5">Total Peningkatan Profit</h3>
                <p className="text-white/70 text-xs">Keseluruhan 10 Produk</p>
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
                  {(peningkatanUtility / 1000000).toFixed(1)}
                  <span className="text-xl opacity-80 ml-1">Jt</span>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-emerald-100 bg-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-400/30 backdrop-blur-md shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Optimalisasi Laba
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Performa Individual Produk</h2>
              <p className="text-xs font-medium text-gray-500 mt-1">Perbandingan performa tiap produk (Sebelum vs Sesudah)</p>
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
          <div className="h-[36rem] w-full relative">
            <Bar id="unifiedChartProduk" data={chartMetric === 'utility' ? utilityChartData : terjualChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
