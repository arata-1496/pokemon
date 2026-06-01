import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ishiguro.pokemontanjoubi',
  appName: 'ポケモン誕生日診断',
  // webDir は next build の出力先（静的ファイル）。
  // サーバーコンポーネントがあるため Vercel にデプロイ済みの URL を参照する。
  webDir: 'out',
  server: {
    // ▼ デプロイ済みの Vercel URL に差し替えてください
    url: 'https://pokemon-diagnosis.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#f48a9c',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
  },
};

export default config;
