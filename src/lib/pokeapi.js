const BASE = 'https://pokeapi.co/api/v2';
const OPT = { next: { revalidate: 3600 } };

async function get(url) {
  const r = await fetch(url, OPT);
  if (!r.ok) return null;
  return r.json();
}

export const fetchPokemon = (id) => get(`${BASE}/pokemon/${id}`);
export const fetchSpecies = (id) => get(`${BASE}/pokemon-species/${id}`);
export const fetchType = (name) => get(`${BASE}/type/${name}`);
export const fetchMove = (url) => get(url);
export const fetchEvolutionChain = (url) => get(url);
export const fetchAbility = (name) => get(`${BASE}/ability/${name}`);
export const fetchItem = (name) => get(`${BASE}/item/${name}`);
export const fetchPokemonList = (limit, offset) =>
  get(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);

export function getJaName(names = []) {
  return (
    names.find((n) => n.language.name === 'ja-Hrkt')?.name ??
    names.find((n) => n.language.name === 'ja')?.name ??
    ''
  );
}

export function getFlavorText(entries = []) {
  return (
    entries
      .filter((e) => e.language.name === 'ja-Hrkt')
      .at(-1)
      ?.flavor_text?.replace(/\f|\n/g, ' ') ?? ''
  );
}

export function getIdFromUrl(url) {
  return parseInt(url?.split('/').filter(Boolean).at(-1) ?? '0');
}

export function officialArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function calcTypeMatchup(typeDataList) {
  const mult = {};
  for (const td of typeDataList) {
    const dr = td.damage_relations;
    for (const t of dr.double_damage_from) mult[t.name] = (mult[t.name] ?? 1) * 2;
    for (const t of dr.half_damage_from)   mult[t.name] = (mult[t.name] ?? 1) * 0.5;
    for (const t of dr.no_damage_from)     mult[t.name] = 0;
  }
  return mult;
}

// Add JP names to evo chain tree (recursive)
export function addNamesToChain(node, nameMap) {
  const id = getIdFromUrl(node.species.url);
  return {
    id,
    name: node.species.name,
    jaName: nameMap[id] ?? '',
    details: node.evolution_details ?? [],
    evolvesTo: node.evolves_to.map((n) => addNamesToChain(n, nameMap)),
  };
}

// Collect all IDs from the chain tree
export function collectChainIds(node) {
  return [
    getIdFromUrl(node.species.url),
    ...node.evolves_to.flatMap(collectChainIds),
  ];
}

// Collect all item/held_item names from raw evo chain (before addNamesToChain)
export function collectEvoItemNames(node) {
  const items = new Set();
  for (const d of node.evolution_details ?? []) {
    if (d.item?.name) items.add(d.item.name);
    if (d.held_item?.name) items.add(d.held_item.name);
  }
  for (const child of node.evolves_to ?? []) {
    for (const name of collectEvoItemNames(child)) items.add(name);
  }
  return items;
}

export function getEvoCondition(detail, itemNameMap = {}) {
  if (!detail) return null;
  if (detail.min_level) return `Lv.${detail.min_level}`;
  if (detail.item) return itemNameMap[detail.item.name] ?? detail.item.name;
  if (detail.held_item) return `${itemNameMap[detail.held_item.name] ?? detail.held_item.name}を持って交換`;
  if (detail.trigger?.name === 'trade') return '通信交換';
  if (detail.min_happiness) return 'なつき度';
  if (detail.known_move) return `${detail.known_move.name}を習得`;
  if (detail.location) return '特定の場所';
  return null;
}

export const TYPE_NAMES_JA = {
  normal: 'ノーマル', fire: 'ほのお', water: 'みず', electric: 'でんき',
  grass: 'くさ', ice: 'こおり', fighting: 'かくとう', poison: 'どく',
  ground: 'じめん', flying: 'ひこう', psychic: 'エスパー', bug: 'むし',
  rock: 'いわ', ghost: 'ゴースト', dragon: 'ドラゴン', dark: 'あく',
  steel: 'はがね', fairy: 'フェアリー',
};

export const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

export const STAT_NAMES_JA = {
  hp: 'HP', attack: 'こうげき', defense: 'ぼうぎょ',
  'special-attack': 'とくこう', 'special-defense': 'とくぼう', speed: 'すばやさ',
};

export const DAMAGE_CLASS_JA = {
  physical: '物理', special: '特殊', status: '変化',
};
