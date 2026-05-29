export const TYPES = ['normal','fire','water','electric','grass','ice','fighting',
  'poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];

// abbreviated Japanese for column headers (1-2 chars each)
export const TYPE_SHORT_JA = {
  normal:'ノ', fire:'炎', water:'水', electric:'電', grass:'草', ice:'氷',
  fighting:'闘', poison:'毒', ground:'地', flying:'飛', psychic:'超',
  bug:'虫', rock:'岩', ghost:'霊', dragon:'竜', dark:'悪', steel:'鋼', fairy:'妖',
};

// Gen 6+ base chart: attacker → { defender: multiplier } (only non-1x)
export const BASE_CHART = {
  normal:   { rock:0.5, ghost:0, steel:0.5 },
  fire:     { fire:0.5, water:0.5, grass:2, ice:2, bug:2, rock:0.5, dragon:0.5, steel:2 },
  water:    { fire:2, water:0.5, grass:0.5, ground:2, rock:2, dragon:0.5 },
  electric: { water:2, electric:0.5, grass:0.5, ground:0, flying:2, dragon:0.5 },
  grass:    { fire:0.5, water:2, grass:0.5, poison:0.5, ground:2, flying:0.5, bug:0.5, rock:2, dragon:0.5, steel:0.5 },
  ice:      { fire:0.5, water:0.5, grass:2, ice:0.5, ground:2, flying:2, dragon:2, steel:0.5 },
  fighting: { normal:2, ice:2, poison:0.5, flying:0.5, psychic:0.5, bug:0.5, rock:2, ghost:0, dark:2, steel:2, fairy:0.5 },
  poison:   { grass:2, poison:0.5, ground:0.5, rock:0.5, ghost:0.5, steel:0, fairy:2 },
  ground:   { fire:2, electric:2, grass:0.5, poison:2, flying:0, bug:0.5, rock:2, steel:2 },
  flying:   { electric:0.5, grass:2, fighting:2, bug:2, rock:0.5, steel:0.5 },
  psychic:  { fighting:2, poison:2, psychic:0.5, dark:0, steel:0.5 },
  bug:      { fire:0.5, grass:2, fighting:0.5, flying:0.5, psychic:2, ghost:0.5, dark:2, steel:0.5, fairy:0.5 },
  rock:     { fire:2, ice:2, fighting:0.5, ground:0.5, flying:2, bug:2, steel:0.5 },
  ghost:    { normal:0, psychic:2, ghost:2, dark:0.5 },
  dragon:   { dragon:2, steel:0.5, fairy:0 },
  dark:     { fighting:0.5, psychic:2, ghost:2, dark:0.5, fairy:0.5 },
  steel:    { fire:0.5, water:0.5, electric:0.5, ice:2, rock:2, steel:0.5, fairy:2 },
  fairy:    { fire:0.5, fighting:2, poison:0.5, dragon:2, dark:2, steel:0.5 },
};

// Returns the chart data (Map-like object) for a given era
export function getChartForEra(era) {
  const chart = {};
  const types = era === 'gen1'
    ? TYPES.filter(t => t !== 'dark' && t !== 'steel' && t !== 'fairy')
    : era === 'gen25'
    ? TYPES.filter(t => t !== 'fairy')
    : TYPES;

  for (const atk of types) {
    chart[atk] = {};
    for (const def of types) {
      let v = BASE_CHART[atk]?.[def] ?? 1;
      // Gen 1 overrides
      if (era === 'gen1') {
        if (atk === 'ghost'  && def === 'psychic') v = 0;   // famous glitch
        if (atk === 'poison' && def === 'bug')     v = 2;   // removed in Gen 2
        if (atk === 'bug'    && def === 'poison')  v = 2;   // removed in Gen 2
      }
      // Gen 2-5 overrides
      if (era === 'gen1' || era === 'gen25') {
        if (atk === 'steel' && def === 'ghost') v = 0;  // Steel immune Gen 2-5
        if (atk === 'steel' && def === 'dark')  v = 0;  // Steel immune Gen 2-5
      }
      chart[atk][def] = v;
    }
  }
  return { chart, types };
}

export const ERA_OPTIONS = [
  { value: 'gen6',  label: 'X・Y 以降（現在）',              games: 'Gen 6+' },
  { value: 'gen25', label: '金・銀 〜 ブラック2・ホワイト2', games: 'Gen 2-5' },
  { value: 'gen1',  label: '赤・緑・青・ピカチュウ',          games: 'Gen 1' },
];
