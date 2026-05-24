import Sidebar from '@/components/Sidebar';
import FloatingFilter from '@/components/FloatingFilter';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <Suspense fallback={null}>
        <FloatingFilter />
      </Suspense>
    </div>
  );
}
