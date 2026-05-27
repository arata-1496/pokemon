const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 20, offset = 0) {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch pokemon list');
  return res.json();
}

export async function getPokemon(nameOrId) {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch pokemon: ${nameOrId}`);
  return res.json();
}

export async function getPokemonSpecies(nameOrId) {
  const res = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch species: ${nameOrId}`);
  return res.json();
}

export function getJapaneseName(species) {
  const jaName = species.names.find((n) => n.language.name === 'ja-Hrkt');
  return jaName?.name ?? species.name;
}

export function getJapaneseFlavorText(species) {
  const entry = species.flavor_text_entries
    .filter((e) => e.language.name === 'ja-Hrkt')
    .at(-1);
  return entry?.flavor_text?.replace(/\f/g, ' ') ?? '';
}

export const TYPE_COLORS = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export const TYPE_NAMES_JA = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
  grass: 'くさ',
  ice: 'こおり',
  fighting: 'かくとう',
  poison: 'どく',
  ground: 'じめん',
  flying: 'ひこう',
  psychic: 'エスパー',
  bug: 'むし',
  rock: 'いわ',
  ghost: 'ゴースト',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fairy: 'フェアリー',
};

export const STAT_NAMES_JA = {
  hp: 'HP',
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  'special-attack': 'とくこう',
  'special-defense': 'とくぼう',
  speed: 'すばやさ',
};
