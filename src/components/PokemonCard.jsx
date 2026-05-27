import Link from 'next/link';
import Image from 'next/image';
import TypeBadge from './TypeBadge';
import { TYPE_COLORS } from '@/lib/pokeapi';

export default function PokemonCard({ pokemon, jaName }) {
  const id = pokemon.id;
  const paddedId = String(id).padStart(4, '0');
  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default;

  const mainType = pokemon.types[0]?.type?.name ?? 'normal';
  const bgMap = {
    normal: 'bg-gray-100',
    fire: 'bg-orange-50',
    water: 'bg-blue-50',
    electric: 'bg-yellow-50',
    grass: 'bg-green-50',
    ice: 'bg-cyan-50',
    fighting: 'bg-red-50',
    poison: 'bg-purple-50',
    ground: 'bg-yellow-50',
    flying: 'bg-indigo-50',
    psychic: 'bg-pink-50',
    bug: 'bg-lime-50',
    rock: 'bg-yellow-50',
    ghost: 'bg-purple-50',
    dragon: 'bg-indigo-50',
    dark: 'bg-gray-200',
    steel: 'bg-slate-100',
    fairy: 'bg-pink-50',
  };
  const cardBg = bgMap[mainType] ?? 'bg-white';

  return (
    <Link href={`/pokemon/${id}`}>
      <div className={`${cardBg} rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-white`}>
        <div className="text-right text-xs text-gray-400 font-mono mb-1">#{paddedId}</div>
        {sprite && (
          <div className="flex justify-center">
            <Image
              src={sprite}
              alt={jaName ?? pokemon.name}
              width={96}
              height={96}
              className="drop-shadow-md"
              unoptimized
            />
          </div>
        )}
        <h3 className="text-center font-bold text-gray-800 mt-2 text-sm">
          {jaName ?? pokemon.name}
        </h3>
        <div className="flex justify-center gap-1 mt-2 flex-wrap">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
      </div>
    </Link>
  );
}
