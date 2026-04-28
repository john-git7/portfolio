import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "John Ebenezer — Full Stack Developer | React, Next.js, Node.js",
  description:
    "Portfolio of John Ebenezer, a Full Stack Developer specializing in React, Next.js, Node.js, and MongoDB. Building elegant digital experiences with modern web technologies.",
  keywords: ["Full Stack Developer", "React", "Next.js", "Node.js", "Portfolio", "John Ebenezer"],
  openGraph: {
    title: "John Ebenezer — Full Stack Developer",
    description: "Building elegant digital experiences with modern web technologies.",
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
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased text-primary-text min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
