import { fetchPokemonList, fetchSpecies, getIdFromUrl, getJaName } from '@/lib/pokeapi';
import SearchClient from '@/components/SearchClient';
import BackButton from '@/components/BackButton';

export const metadata = { title: '詳細検索 - ポケモン図鑑' };

export default async function SearchPage() {
  const data = await fetchPokemonList(1025, 0);
  const baseList = (data?.results ?? []).map((p) => ({
    id: getIdFromUrl(p.url),
    name: p.name,
  }));

  const speciesData = await Promise.all(baseList.map((p) => fetchSpecies(p.id)));

  const list = baseList.map((p, i) => ({
    ...p,
    jaName: getJaName(speciesData[i]?.names ?? []) || p.name,
  }));

  return (
    <main
      className="flex flex-col bg-pokeballs"
      style={{ minHeight: '100dvh' }}
    >
      <div
        className="px-5 pb-3"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
      >
        <BackButton />
        <h1
          className="text-2xl font-black text-white text-center mt-1"
          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}
        >
          詳細検索
        </h1>
      </div>
      <div
        className="flex-1"
        style={{ paddingBottom: 'max(5rem, calc(3.5rem + env(safe-area-inset-bottom)))' }}
      >
        <SearchClient list={list} />
      </div>
    </main>
  );
}
