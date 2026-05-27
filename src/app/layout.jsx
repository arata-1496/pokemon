import './globals.css';

export const metadata = {
  title: 'ポケモン誕生日診断',
  description: '生年月日からあなたのポケモンを診断！',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
