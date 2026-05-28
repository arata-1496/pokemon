export default function manifest() {
  return {
    name: 'ポケモン誕生日診断',
    short_name: 'ポケモン診断',
    description: '生年月日からあなたのポケモンを診断！',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f48a9c',
    theme_color: '#f48a9c',
    lang: 'ja',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}
