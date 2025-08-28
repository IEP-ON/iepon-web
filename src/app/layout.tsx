import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/design-system.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IEPON - 개별화 교육 프로그램 온라인 네트워크",
  description: "AI 기반 개별화 학습으로 모든 학생의 잠재력을 실현하세요",
  keywords: ["교육", "개별화", "AI", "학습", "학생관리"],
  authors: [{ name: "IEPON Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
