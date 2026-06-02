const BASE = 'https://pokeapi.co/api/v2';

async function get(url: string) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export const fetchPokemon    = (id: number | string) => get(`${BASE}/pokemon/${id}`);
export const fetchSpecies    = (id: number | string) => get(`${BASE}/pokemon-species/${id}`);
export const fetchType       = (name: string)        => get(`${BASE}/type/${name}`);
export const fetchMove       = (url: string)         => get(url);
export const fetchEvolution  = (url: string)         => get(url);
export const fetchAbility    = (name: string)        => get(`${BASE}/ability/${name}`);
export const fetchPokemonList= (limit: number, offset: number) =>
  get(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);

export function officialArtwork(id: number | string) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
export function shinyArtwork(id: number | string) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

export function getJaName(names: any[] = []) {
  return (
    names.find((n: any) => n.language.name === 'ja-Hrkt')?.name ??
    names.find((n: any) => n.language.name === 'ja')?.name ??
    ''
  );
}

export function getFlavorText(entries: any[] = []) {
  return (
    entries
      .filter((e: any) => e.language.name === 'ja-Hrkt')
      .at(-1)
      ?.flavor_text?.replace(/\f|\n/g, ' ') ?? ''
  );
}

export function getIdFromUrl(url: string) {
  return parseInt(url?.split('/').filter(Boolean).at(-1) ?? '0');
}

export function calcTypeMatchup(typeDataList: any[]) {
  const mult: Record<string, number> = {};
  for (const td of typeDataList) {
    const dr = td.damage_relations;
    for (const t of dr.double_damage_from) mult[t.name] = (mult[t.name] ?? 1) * 2;
    for (const t of dr.half_damage_from)   mult[t.name] = (mult[t.name] ?? 1) * 0.5;
    for (const t of dr.no_damage_from)     mult[t.name] = 0;
  }
  return mult;
}

export function addNamesToChain(node: any, nameMap: Record<number, string>): any {
  const id = getIdFromUrl(node.species.url);
  return {
    id,
    name: node.species.name,
    jaName: nameMap[id] ?? '',
    details: node.evolution_details ?? [],
    evolvesTo: node.evolves_to.map((n: any) => addNamesToChain(n, nameMap)),
  };
}

export function collectChainIds(node: any): number[] {
  return [getIdFromUrl(node.species.url), ...node.evolves_to.flatMap(collectChainIds)];
}

export function getEvoCondition(detail: any): string | null {
  if (!detail) return null;
  if (detail.min_level) return `Lv.${detail.min_level}`;
  if (detail.item) return detail.item.name;
  if (detail.held_item) return `${detail.held_item.name}を持って交換`;
  if (detail.trigger?.name === 'trade') return '通信交換';
  if (detail.min_happiness) return 'なつき度';
  if (detail.known_move) return `${detail.known_move.name}を習得`;
  return null;
}

export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

export const TYPE_NAMES_JA: Record<string, string> = {
  normal: 'ノーマル', fire: 'ほのお', water: 'みず', electric: 'でんき',
  grass: 'くさ', ice: 'こおり', fighting: 'かくとう', poison: 'どく',
  ground: 'じめん', flying: 'ひこう', psychic: 'エスパー', bug: 'むし',
  rock: 'いわ', ghost: 'ゴースト', dragon: 'ドラゴン', dark: 'あく',
  steel: 'はがね', fairy: 'フェアリー',
};

export const STAT_NAMES_JA: Record<string, string> = {
  hp: 'HP', attack: 'こうげき', defense: 'ぼうぎょ',
  'special-attack': 'とくこう', 'special-defense': 'とくぼう', speed: 'すばやさ',
};

export const DAMAGE_CLASS_JA: Record<string, string> = {
  physical: '物理', special: '特殊', status: '変化',
};
