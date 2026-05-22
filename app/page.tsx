import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/bg.webp"
            alt="Background sarung"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center mt-12 md:mt-0">

          <h1 className="text-[2.25rem] sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 leading-[1.15] md:leading-tight tracking-tight drop-shadow-lg opacity-0-init animate-fade-in-up w-full max-w-full md:max-w-none mx-auto" style={{ animationDuration: '1.5s' }}>
            <span className="text-amber-400 select-none">Optimasi Bundling</span>{' '}
            <span className="block md:inline md:ml-3">Berbasis Data</span>
          </h1>

          <p className="text-[15px] sm:text-base md:text-lg text-gray-200 mb-8 md:mb-10 max-w-[20rem] sm:max-w-[24rem] md:max-w-xl mx-auto leading-relaxed font-light drop-shadow opacity-0-init animate-fade-in-up delay-200" style={{ animationDuration: '1.5s' }}>
            Sistem rekomendasi strategi bundling terbaik berdasarkan riwayat penjualan toko untuk memaksimalkan profitabilitas.
          </p>

          <div className="opacity-0-init animate-fade-in-up delay-400 w-full sm:w-auto px-4 sm:px-0" style={{ animationDuration: '1.5s' }}>
            <button className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 bg-amber-400 text-black font-bold px-8 md:px-10 py-[18px] md:py-4 rounded-full hover:bg-amber-300 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_0_60px_-15px_rgba(251,191,36,0.8)] hover:-translate-y-1 text-[1.1rem] md:text-lg">
              Lihat Dashboard
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Section Tentang */}
      <section id="tentang" className="relative min-h-screen py-24 flex items-center bg-[#050505] overflow-hidden">
        <div className="w-full max-w-[72rem] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Bagian Kiri (Teks Penjelasan) */}
            <div className="flex flex-col gap-5 order-2 lg:order-1 relative z-10">
              <ScrollReveal animationClass="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit backdrop-blur-sm">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-xs font-bold tracking-widest uppercase">Tentang SmartBundle</span>
                </div>
              </ScrollReveal>

              <ScrollReveal animationClass="animate-fade-in-up delay-100">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  Meninggalkan <br className="hidden lg:block" /> Cara <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Manual</span>
                </h2>
              </ScrollReveal>

              <div className="space-y-4 text-base md:text-lg text-gray-400 leading-relaxed font-light">
                <ScrollReveal animationClass="animate-fade-in-up delay-200">
                  <p>
                    Di tengah persaingan e-commerce yang semakin ketat, menentukan paket bundling produk <strong className="text-white font-medium">tidak bisa lagi hanya mengandalkan intuisi</strong>.
                  </p>
                </ScrollReveal>
                <ScrollReveal animationClass="animate-fade-in-up delay-300">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
                    <div className="absolute left-0 top-0 w-1 h-full bg-amber-500 group-hover:w-1.5 transition-all"></div>
                    <p className="pl-3">
                      <strong className="text-amber-400 font-semibold tracking-wide">SmartBundle</strong> hadir untuk menganalisis ribuan data transaksi toko Anda, menemukan kombinasi produk yang paling sering dibeli bersamaan dan menghasilkan keuntungan nyata.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Bagian Kanan (Visual) */}
            <div className="relative order-1 lg:order-2 flex justify-center w-full">
              {/* Dekorasi Glow Belakang Mockup */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-500/15 rounded-full blur-[100px] -z-10"></div>

              <ScrollReveal animationClass="animate-fade-in-left delay-300" className="w-full flex justify-center">
                <div className="relative w-full max-w-lg transition-transform hover:-translate-y-2 duration-500">
                  {/* Outer Glass Frame */}
                  <div className="p-2 md:p-3 rounded-[2rem] bg-white/5 border border-white/10 shadow-[0_0_50px_-12px_rgba(251,191,36,0.15)] backdrop-blur-xl">
                    {/* Inner Mockup Container */}
                    <div className="relative rounded-[1.5rem] overflow-hidden bg-[#0f0f13] aspect-[4/3] w-full shadow-inner border border-white/5">
                      {/* Top Bar Aksesoris */}
                      <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-600 z-20"></div>

                      {/* Mockup Image */}
                      <Image
                        src="/img/mockup-shopee.png"
                        alt="Mockup Toko Shopee"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105 opacity-90 hover:opacity-100"
                      />

                      {/* Soft Overlay Bawah agar menyatu */}
                      <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-[#0f0f13] to-transparent z-10 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Section Cara Kerja */}
      <section id="cara-kerja" className="relative min-h-screen py-24 flex items-center bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="w-full max-w-[76rem] mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <ScrollReveal animationClass="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 mb-6">
                <span className="text-sm font-bold tracking-widest uppercase">Cara Kerja Sistem</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Dari Data Penjualan<br className="hidden sm:block" /> Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Strategi Cerdas</span></h2>
            </ScrollReveal>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 z-10">
            {/* Connecting dashed line for lg screens */}
            <div className="hidden lg:block absolute top-[4.5rem] left-[12.5%] w-[75%] border-t-2 border-dashed border-amber-200 -z-10 opacity-70"></div>

            {/* Card 1 */}
            <ScrollReveal animationClass="animate-fade-in-up delay-100" className="h-full">
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-6 text-9xl font-black text-gray-50 opacity-60 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 pointer-events-none select-none">1</div>
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm border border-amber-100 group-hover:border-amber-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Tarik Data</h3>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                  Sistem memproses data riil dari riwayat pesanan pelanggan toko Anda secara menyeluruh.
                </p>
                <div className="mt-auto pt-6 relative z-10">
                  <span className="inline-flex px-3 py-1 bg-amber-50/80 text-amber-700 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-amber-100/50">Studi: 7.625 Transaksi</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal animationClass="animate-fade-in-up delay-200" className="h-full">
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-6 text-9xl font-black text-gray-50 opacity-60 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 pointer-events-none select-none">2</div>
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm border border-amber-100 group-hover:border-amber-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Analisis FHM</h3>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                  Algoritma Fast High-Utility Mining bekerja ekstra cepat menghitung nilai profit dari setiap kombinasi produk.
                </p>
                <div className="mt-auto pt-6 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 text-amber-700 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-amber-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Kecepatan Tinggi
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal animationClass="animate-fade-in-up delay-300" className="h-full">
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-6 text-9xl font-black text-gray-50 opacity-60 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 pointer-events-none select-none">3</div>
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm border border-amber-100 group-hover:border-amber-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Hasil Rekomendasi</h3>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                  Sistem mengeluarkan kombinasi unggulan. Contoh: menggabungkan produk laris dengan produk kurang diminati.
                </p>
                <div className="mt-auto pt-6 relative z-10">
                  <span className="inline-flex px-3 py-1 bg-amber-50/80 text-amber-700 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-amber-100/50">Penjualan Naik</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal animationClass="animate-fade-in-up delay-400" className="h-full">
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-6 text-9xl font-black text-gray-50 opacity-60 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 pointer-events-none select-none">4</div>
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm border border-amber-100 group-hover:border-amber-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Terapkan Diskon</h3>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                  Terapkan kombinasi pada fitur Kombo Shopee dengan potongan harga 5% untuk menarik minat pembeli.
                </p>
                <div className="mt-auto pt-6 relative z-10">
                  <span className="inline-flex px-3 py-1 bg-amber-50/80 text-amber-700 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-amber-100/50">Profit Maksimal</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] pt-16 pb-8 border-t border-white/5 relative overflow-hidden">
        {/* Subtle grid pattern for footer */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-[76rem] mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">

            {/* Left - Brand & Info */}
            <div className="col-span-1 md:col-span-5 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image src="/img/logo.png" alt="SmartBundle Logo" fill className="object-contain drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">SmartBundle</h3>
                  <p className="text-amber-500/80 text-[10px] font-bold tracking-widest uppercase mt-0.5">Data-Driven Optimization</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                Sistem rekomendasi strategi bundling berbasis data yang menggabungkan algoritma Fast High-Utility Mining untuk membantu UMKM memaksimalkan profitabilitas.
              </p>

              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all group">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Middle - Navigasi */}
            <div className="col-span-1 md:col-span-3 lg:col-span-2 lg:col-start-7">
              <h4 className="text-white font-bold mb-6 tracking-wide">Navigasi</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Beranda</a></li>
                <li><a href="#tentang" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Tentang</a></li>
                <li><a href="#cara-kerja" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Cara Kerja</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Dashboard</a></li>
              </ul>
            </div>

            {/* Right - Penelitian */}
            <div className="col-span-1 md:col-span-4 lg:col-span-4">
              <h4 className="text-white font-bold mb-6 tracking-wide">Penelitian</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Dikembangkan sebagai bagian dari penelitian tugas akhir tentang implementasi Algoritma Fast High-Utility Mining (FHM) untuk sistem rekomendasi bundling.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
                <span className="text-xs font-semibold tracking-wide">Academic Research 2026</span>
              </div>
            </div>

          </div>

          {/* Bottom - Copyright */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; 2026 SmartBundle. Dibuat untuk keperluan penelitian akademik.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
