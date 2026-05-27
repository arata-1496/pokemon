import './globals.css';

export const metadata = {
  title: 'ポケモン図鑑',
  description: 'PokeAPIを使ったポケモン図鑑アプリ',
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
