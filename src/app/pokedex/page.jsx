import { fetchPokemonList, fetchSpecies, getIdFromUrl, getJaName, mapLimit } from '@/lib/pokeapi';
import PokedexSearch from '@/components/PokedexSearch';
import BackButton from '@/components/BackButton';

export const metadata = { title: 'ポケモン図鑑' };

export default async function PokedexPage() {
  const data = await fetchPokemonList(1025, 0);
  const baseList = (data?.results ?? []).map((p) => ({
    id: getIdFromUrl(p.url),
    name: p.name,
  }));

  // Fetch all species for Japanese names (cached 1h), capped at 40 concurrent
  // requests so the build doesn't exhaust sockets / hit rate limits.
  const speciesData = await mapLimit(baseList, 40, (p) => fetchSpecies(p.id));

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
          ポケモン図鑑
        </h1>
      </div>
      <div
        className="flex-1"
        style={{ paddingBottom: 'max(5rem, calc(3.5rem + env(safe-area-inset-bottom)))' }}
      >
        <PokedexSearch list={list} />
      </div>
    </main>
  );
}
