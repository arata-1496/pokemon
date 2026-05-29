import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import TabBar from '@/components/TabBar';

export const metadata = {
  title: 'ポケモン誕生日診断',
  description: '生年月日からあなたのポケモンを診断！',
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: 'ポケモン診断',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f48a9c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
        <TabBar />
      </body>
    </html>
  );
}
