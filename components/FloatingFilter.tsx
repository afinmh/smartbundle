"use client";

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function FloatingFilter() {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // default to all available years
  const selectedYearsParam = searchParams.get('years') || '2025,2026';
  const selectedYears = selectedYearsParam.split(',').filter(Boolean);

  if (pathname.startsWith('/dashboard/bundling')) {
    return null;
  }

  const toggleSelection = (type: 'years', value: string) => {
    const currentList = [...selectedYears];
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
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative w-14 h-14">
        {/* Child bubbles */}
        <button 
          onClick={() => toggleSelection('years', '2026')}
          className={`absolute w-12 h-12 left-1 top-1 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-300 hover:scale-110 ${filterOpen ? 'opacity-100 scale-100 translate-x-0 translate-y-[-72px]' : 'opacity-0 scale-50 translate-x-0 translate-y-0 pointer-events-none'} ${selectedYears.includes('2026') ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}`}
        >
          2026
        </button>
        <button 
          onClick={() => toggleSelection('years', '2025')}
          className={`absolute w-12 h-12 left-1 top-1 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-300 hover:scale-110 ${filterOpen ? 'opacity-100 scale-100 translate-x-[-72px] translate-y-0' : 'opacity-0 scale-50 translate-x-0 translate-y-0 pointer-events-none'} ${selectedYears.includes('2025') ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}`}
        >
          2025
        </button>

        {/* Main Bubble */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`absolute inset-0 w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center transition-transform duration-300 hover:scale-105 z-10 ${filterOpen ? 'bg-amber-500' : ''}`}
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
    </div>
  );
}