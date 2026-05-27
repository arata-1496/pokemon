import { Suspense } from 'react';
import { getPokemonList, getPokemon, getPokemonSpecies, getJapaneseName } from '@/lib/pokeapi';
import PokemonCard from '@/components/PokemonCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 24;
const TOTAL_POKEMON = 1025;

async function PokemonGrid({ searchParams }) {
  const query = searchParams?.q?.trim();
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10));

  if (query) {
    const nameOrId = isNaN(Number(query)) ? query.toLowerCase() : Number(query);
    try {
      const pokemon = await getPokemon(nameOrId);
      const species = await getPokemonSpecies(pokemon.species.name);
      const jaName = getJapaneseName(species);
      return (
        <div>
          <p className="text-center text-gray-500 mb-6 text-sm">
            「{query}」の検索結果: 1件
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <PokemonCard pokemon={pokemon} jaName={jaName} />
          </div>
        </div>
      );
    } catch {
      return (
        <p className="text-center text-gray-500 py-16">
          「{query}」に一致するポケモンが見つかりませんでした。
        </p>
      );
    }
  }

  const offset = (page - 1) * PAGE_SIZE;
  const listData = await getPokemonList(PAGE_SIZE, offset);
  const totalPages = Math.ceil(TOTAL_POKEMON / PAGE_SIZE);

  const pokemonList = await Promise.all(
    listData.results.map(async (item) => {
      const pokemon = await getPokemon(item.name);
      const species = await getPokemonSpecies(pokemon.species.name);
      const jaName = getJapaneseName(species);
      return { pokemon, jaName };
    })
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {pokemonList.map(({ pokemon, jaName }) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} jaName={jaName} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-black text-red-600 mb-1">ポケモン図鑑</h1>
        <p className="text-gray-500 text-sm">全{new Intl.NumberFormat('ja').format(1025)}種のポケモン</p>
      </header>

      <div className="mb-8">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-20 text-gray-400 text-lg">読み込み中...</div>
        }
      >
        <PokemonGrid searchParams={params} />
      </Suspense>
    </main>
  );
}
