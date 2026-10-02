import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '사주 · 타로 · 오늘의 운세',
  description: '생년월일로 사주팔자를 풀이하고, 타로와 오늘의 운세까지 한 자리에서',
};

// next/font/google의 번들 메타데이터에는 Noto Sans KR/Song Myung의 'korean' 서브셋이
// 없어서(latin만 선택하면 한글 글리프가 빠짐) Google Fonts CSS를 직접 불러옵니다.
// 이 <link>는 App Router의 루트 레이아웃이라 모든 페이지에 적용되므로
// no-page-custom-font 경고(Pages Router 기준 규칙)는 .eslintrc.json에서 껐습니다.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Song+Myung&family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
