import { notFound } from 'next/navigation';
import ResultDisplay from '@/components/ResultDisplay';

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchJaName(speciesUrl) {
  const res = await fetch(speciesUrl, { next: { revalidate: 3600 } });
  if (!res.ok) return '';
  const data = await res.json();
  return (
    data.names.find((n) => n.language.name === 'ja-Hrkt')?.name ??
    data.names.find((n) => n.language.name === 'ja')?.name ??
    ''
  );
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const id = Number(params.id);
  return {
    title: `No.${String(id).padStart(4, '0')} - ポケモン誕生日診断`,
  };
}

export default async function ResultPage({ searchParams }) {
  const params = await searchParams;
  const id = Number(params.id);

  if (!id || id < 1 || id > 1025) notFound();

  const pokemon = await fetchPokemon(id);
  if (!pokemon) notFound();

  const jaName = await fetchJaName(pokemon.species.url);

  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default ??
    '';

  return (
    <ResultDisplay
      sprite={sprite}
      name={pokemon.name}
      jaName={jaName || pokemon.name}
      id={id}
      ys={Number(params.ys ?? 0)}
      dn={Number(params.dn ?? 0)}
      raw={Number(params.raw ?? id)}
    />
  );
}
