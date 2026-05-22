import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl backdrop-blur-xl bg-black/40 border border-white/10 rounded-full shadow-2xl transition-all duration-300">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/img/logo.png"
              alt="SmartBundle Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">
            SmartBundle
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4 bg-white/5 rounded-full p-1 border border-white/5">
            <Link 
              href="#tentang" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-1.5 rounded-full hover:bg-white/10"
            >
              Tentang
            </Link>
            <Link 
              href="#cara-kerja" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-1.5 rounded-full hover:bg-white/10"
            >
              Cara Kerja
            </Link>
          </div>
          <Link 
            href="/dashboard" 
            className="text-sm font-semibold bg-white text-black px-6 py-2 rounded-full transition-all hover:bg-gray-200 hover:scale-105 active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}