import TypeChart from '@/components/TypeChart';
import { TYPE_NAMES_JA } from '@/lib/pokeapi';

export const metadata = { title: 'タイプ相性表 - ポケモン図鑑' };

export default function TypesPage() {
  return (
    <main className="flex flex-col bg-pokeballs" style={{ minHeight: '100dvh' }}>
      <div className="px-5 pb-3" style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}>
        <h1 className="text-2xl font-black text-white text-center" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>
          タイプ相性表
        </h1>
      </div>
      <div className="flex-1 px-3 pb-2" style={{ paddingBottom: 'max(5rem, calc(3.5rem + env(safe-area-inset-bottom)))' }}>
        <TypeChart typeNamesJa={TYPE_NAMES_JA} />
      </div>
    </main>
  );
}
