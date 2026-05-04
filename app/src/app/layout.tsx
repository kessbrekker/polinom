import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A(x) ↦ P(x) - Polinom Çözümleyici",
  description: "Cebirsel ifadeleri polinom biçimine indirgeyen ve analiz eden interaktif araç.",
  icons: {
    icon: '/favicon.svg',
  },
};

import { FaGithub } from "react-icons/fa";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="w-full h-16 flex items-center justify-center bg-[#020617] border-t border-slate-800/50">
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500">2026 © Kess, Inc.</p>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
            <a
              href="https://github.com/kessbrekker/polinom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <FaGithub className="w-4 h-4" />
              <span>Open Source</span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
