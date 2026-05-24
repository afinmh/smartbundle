export default function Analytics() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-gray-500 mt-1">Analisis mendalam tentang perilaku pembelian pengguna dan performa bundling.</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-16 h-16 text-amber-500 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Halaman Analytics Segera Hadir</h2>
        <p className="text-gray-500 text-center max-w-md">
          Kami sedang dalam proses mengembangkan tampilan data analisis tingkat lanjut untuk meningkatkan konversi strategi bundling toko Anda.
        </p>
      </div>
    </div>
  );
}