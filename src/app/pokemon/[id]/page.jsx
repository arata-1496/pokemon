import Image from 'next/image';
import Link from 'next/link';
import { getPokemon, getPokemonSpecies, getJapaneseName, getJapaneseFlavorText } from '@/lib/pokeapi';
import TypeBadge from '@/components/TypeBadge';
import { STAT_NAMES_JA, TYPE_COLORS } from '@/lib/pokeapi';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const pokemon = await getPokemon(id);
    const species = await getPokemonSpecies(pokemon.species.name);
    const jaName = getJapaneseName(species);
    return { title: `${jaName} - ポケモン図鑑` };
  } catch {
    return { title: 'ポケモン図鑑' };
  }
}

const BG_GRADIENT = {
  normal: 'from-gray-200 to-gray-100',
  fire: 'from-orange-200 to-orange-50',
  water: 'from-blue-200 to-blue-50',
  electric: 'from-yellow-200 to-yellow-50',
  grass: 'from-green-200 to-green-50',
  ice: 'from-cyan-200 to-cyan-50',
  fighting: 'from-red-200 to-red-50',
  poison: 'from-purple-200 to-purple-50',
  ground: 'from-yellow-300 to-yellow-100',
  flying: 'from-indigo-200 to-indigo-50',
  psychic: 'from-pink-200 to-pink-50',
  bug: 'from-lime-200 to-lime-50',
  rock: 'from-yellow-300 to-yellow-100',
  ghost: 'from-purple-300 to-purple-100',
  dragon: 'from-indigo-300 to-indigo-100',
  dark: 'from-gray-400 to-gray-200',
  steel: 'from-slate-300 to-slate-100',
  fairy: 'from-pink-200 to-pink-50',
};

export default async function PokemonDetail({ params }) {
  const { id } = await params;
  let pokemon, species;
  try {
    pokemon = await getPokemon(id);
    species = await getPokemonSpecies(pokemon.species.name);
  } catch {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">ポケモンが見つかりませんでした。</p>
        <Link href="/" className="text-red-500 hover:underline mt-4 inline-block">← 図鑑に戻る</Link>
      </main>
    );
  }

  const jaName = getJapaneseName(species);
  const flavorText = getJapaneseFlavorText(species);
  const paddedId = String(pokemon.id).padStart(4, '0');
  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default;
  const mainType = pokemon.types[0]?.type?.name ?? 'normal';
  const gradient = BG_GRADIENT[mainType] ?? 'from-gray-100 to-white';

  const maxStat = 255;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 mb-6 font-medium text-sm"
      >
        ← 図鑑に戻る
      </Link>

      <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 shadow-lg mb-6`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {sprite && (
            <Image
              src={sprite}
              alt={jaName}
              width={180}
              height={180}
              className="drop-shadow-xl"
              unoptimized
            />
          )}
          <div className="text-center sm:text-left">
            <p className="text-gray-400 font-mono text-sm">#{paddedId}</p>
            <h1 className="text-4xl font-black text-gray-800 mb-3">{jaName}</h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{flavorText}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">たかさ</p>
          <p className="text-2xl font-bold text-gray-800">{(pokemon.height / 10).toFixed(1)} m</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">おもさ</p>
          <p className="text-2xl font-bold text-gray-800">{(pokemon.weight / 10).toFixed(1)} kg</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-700 mb-4">基本ステータス</h2>
        <div className="space-y-3">
          {pokemon.stats.map((s) => {
            const name = STAT_NAMES_JA[s.stat.name] ?? s.stat.name;
            const pct = Math.round((s.base_stat / maxStat) * 100);
            const typeColor = mainType === 'dark' ? 'bg-gray-600' : `bg-${mainType === 'normal' ? 'gray' : mainType}-500`;
            return (
              <div key={s.stat.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 text-right shrink-0">{name}</span>
                <span className="text-sm font-bold text-gray-700 w-8 text-right shrink-0">{s.base_stat}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {pokemon.abilities?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-3">とくせい</h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((a) => (
              <span
                key={a.ability.name}
                className={`px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 ${a.is_hidden ? 'border border-dashed border-gray-400' : ''}`}
              >
                {a.ability.name}
                {a.is_hidden && <span className="ml-1 text-xs text-gray-400">(かくれ)</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
