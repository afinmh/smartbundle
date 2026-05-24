"use client";

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function FloatingFilter() {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // default to all available years and months
  const selectedYearsParam = searchParams.get('years') || '2025,2026';
  const selectedMonthsParam = searchParams.get('months') || 'januari,februari,maret';

  const selectedYears = selectedYearsParam.split(',').filter(Boolean);
  const selectedMonths = selectedMonthsParam.split(',').filter(Boolean);

  const toggleSelection = (type: 'years' | 'months', value: string) => {
    const currentList = type === 'years' ? [...selectedYears] : [...selectedMonths];
    const index = currentList.indexOf(value);
    
    if (index > -1) {
       // Prevent deselecting if it's the last selected item
       if (currentList.length > 1) {
           currentList.splice(index, 1);
       }
    } else {
       currentList.push(value);
    }
    
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(type, currentList.join(','));
    router.push(`${pathname}?${newParams.toString()}`);
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Child bubbles */}
      <div className={`absolute bottom-16 right-0 flex flex-col items-end gap-3 transition-all duration-300 ease-in-out origin-bottom-right ${filterOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleSelection('years', '2026')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-110 ${selectedYears.includes('2026') ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}`}
          >
            2026
          </button>
          <button 
            onClick={() => toggleSelection('years', '2025')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-110 ${selectedYears.includes('2025') ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}`}
          >
            2025
          </button>
        </div>
        <div className="flex gap-2 mt-1">
          <button 
            onClick={() => toggleSelection('months', 'maret')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-110 ${selectedMonths.includes('maret') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Mar
          </button>
          <button 
            onClick={() => toggleSelection('months', 'februari')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-110 ${selectedMonths.includes('februari') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Feb
          </button>
          <button 
            onClick={() => toggleSelection('months', 'januari')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-110 ${selectedMonths.includes('januari') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Jan
          </button>
        </div>
      </div>

      {/* Main Bubble */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className={`w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center transition-transform duration-300 hover:scale-105 ${filterOpen ? 'bg-amber-500' : ''}`}
      >
        {filterOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        )}
      </button>
    </div>
  );
}