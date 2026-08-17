import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
// @ts-ignore
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

import SmoothScroller from "@/components/SmoothScroller";

export const metadata: Metadata = {
  title: "John Ebenezer | Developer",
  description: "Computer Science student and Full-Stack Developer focused on building AI tools.",
  openGraph: {
    title: "John Ebenezer | Developer",
    description: "Computer Science student and Full-Stack Developer focused on building AI tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-bg-base text-text-primary selection:bg-accent selection:text-bg-base`}>
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          {/* Subtle paper grain and technical grid */}
          <div className="absolute inset-0 bg-paper-texture opacity-5 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>
        <Suspense fallback={null}>
          <SmoothScroller>
            {children}
          </SmoothScroller>
        </Suspense>
      </body>
    </html>
  );
}
