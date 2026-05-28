import { fetchPokemonList, getIdFromUrl } from '@/lib/pokeapi';
import PokedexSearch from '@/components/PokedexSearch';
import BackButton from '@/components/BackButton';

export const metadata = { title: 'ポケモン図鑑' };

export default async function PokedexPage() {
  const data = await fetchPokemonList(1025, 0);
  const list = (data?.results ?? []).map((p) => ({
    id: getIdFromUrl(p.url),
    name: p.name,
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
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <PokedexSearch list={list} />
      </div>
    </main>
  );
}
