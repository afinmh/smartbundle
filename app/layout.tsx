import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL('https://smartbundle.netlify.app'),
  title: "SmartBundle - Optimasi Bundling Berbasis Data",
  description: "Sistem rekomendasi strategi bundling berbasis data menggunakan algoritma Fast High-Utility Mining untuk UMKM.",
  icons: {
    icon: '/img/logo.png',
  },
  openGraph: {
    title: "SmartBundle - Optimasi Bundling Berbasis Data",
    description: "Sistem rekomendasi strategi bundling berbasis data menggunakan algoritma Fast High-Utility Mining untuk UMKM.",
    url: 'https://smartbundle.netlify.app',
    siteName: 'SmartBundle',
    images: [
      {
        url: '/image.png',
        width: 1200,
        height: 630,
        alt: 'SmartBundle Preview',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SmartBundle - Optimasi Bundling Berbasis Data",
    description: "Sistem rekomendasi strategi bundling berbasis data menggunakan algoritma Fast High-Utility Mining untuk UMKM.",
    images: ['/image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
