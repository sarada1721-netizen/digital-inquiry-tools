import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '디지털 탐구 도구 - PASCO MBL 가상 센서 인터랙티브 과학 교구',
  description: '고등학교 2학년 과학 탐구 수업을 위한 인터랙티브 MBL 가상 센서(pH, 온도, 기압, 전도도, 스마트카트) 시뮬레이션 및 데이터 시각화 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen relative antialiased selection:bg-pink-300 selection:text-black">
        {children}
      </body>
    </html>
  );
}
