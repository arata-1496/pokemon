'use client';
import { useState, useMemo, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Check } from 'lucide-react';
import { officialArtwork } from '@/lib/pokeapi';
import { MEGA_RAW, ALT_FORM_RAW, formCategory } from '@/lib/forms';
import GlassSelect from '@/components/GlassSelect';

const PAGE_SIZE = 60;

// ─── game dex whitelists ──────────────────────────────────────────────────────

const LGPE_SET = new Set([
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,
  29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,
  54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,
  79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,
  103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,
  122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,
  141,142,143,144,145,146,147,148,149,150,151,808,809,
]);

const HISUI_SET = new Set([
  25,26,35,36,37,38,41,42,46,47,54,55,58,59,63,64,65,66,67,68,72,73,74,75,76,
  77,78,81,82,92,93,94,95,100,101,108,111,112,113,114,122,123,125,126,129,130,
  133,134,135,136,137,143,155,156,157,169,172,173,175,176,185,190,193,196,197,
  198,200,201,207,208,211,212,214,215,216,217,220,221,223,224,226,233,234,239,
  240,242,265,266,267,268,269,280,281,282,299,315,339,340,355,356,358,361,362,
  363,364,365,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,
  403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,
  422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,
  441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,
  460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,
  479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,501,502,503,548,
  549,550,570,571,627,628,641,642,645,700,704,705,706,712,713,722,723,724,899,
  900,901,902,903,904,905,
]);

const ZA_SET = new Set([
  1,2,3,4,5,6,7,8,9,13,14,15,16,17,18,23,24,25,26,35,36,63,64,65,66,67,68,69,
  70,71,79,80,92,93,94,95,115,120,121,123,127,129,130,133,134,135,136,142,147,
  148,149,150,152,153,154,158,159,160,167,168,172,173,179,180,181,196,197,199,
  208,212,214,225,227,228,229,246,247,248,280,281,282,302,303,304,305,306,307,
  308,309,310,315,318,319,322,323,333,334,353,354,359,361,362,371,372,373,374,
  375,376,406,407,427,428,443,444,445,447,448,449,450,459,460,470,471,475,478,
  498,499,500,504,505,511,512,513,514,515,516,529,530,531,543,544,545,551,552,
  553,559,560,568,569,582,583,584,587,602,603,604,607,608,609,618,650,651,652,
  653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,
  672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,
  691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,
  710,711,712,713,714,715,716,717,718,719,780,870,
]);

// ─── regions & games ──────────────────────────────────────────────────────────

const REGIONS = [
  { value: 'all',    label: 'すべて' },
  { value: 'kanto',  label: 'カントー地方', min: 1,   max: 151  },
  { value: 'johto',  label: 'ジョウト地方', min: 152, max: 251  },
  { value: 'hoenn',  label: 'ホウエン地方', min: 252, max: 386  },
  { value: 'sinnoh', label: 'シンオウ地方', min: 387, max: 493  },
  { value: 'unova',  label: 'イッシュ地方', min: 494, max: 649  },
  { value: 'kalos',  label: 'カロス地方',   min: 650, max: 721  },
  { value: 'alola',  label: 'アローラ地方', min: 722, max: 809  },
  { value: 'galar',  label: 'ガラル地方',   min: 810, max: 905  },
  { value: 'paldea', label: 'パルデア地方', min: 906, max: 1025 },
];

const GAMES = [
  { value: 'all',  label: 'すべて' },
  { value: 'rby',  label: '赤・緑・青',                                  min: 1,   max: 151  },
  { value: 'gsc',  label: '金・銀・クリスタル',                          min: 152, max: 251  },
  { value: 'rse',  label: 'ルビー・サファイア・エメラルド',              min: 252, max: 386  },
  { value: 'dppt', label: 'ダイヤモンド・パール・プラチナ',              min: 387, max: 493  },
  { value: 'hgss', label: 'ハートゴールド・ソウルシルバー',              min: 152, max: 251  },
  { value: 'bw',   label: 'ブラック・ホワイト',                          min: 494, max: 649  },
  { value: 'bw2',  label: 'ブラック2・ホワイト2',                        min: 494, max: 649  },
  { value: 'xy',   label: 'X・Y',                                        min: 650, max: 721  },
  { value: 'oras', label: 'オメガルビー・アルファサファイア',            min: 252, max: 386  },
  { value: 'sm',   label: 'サン・ムーン',                                min: 722, max: 809  },
  { value: 'usum', label: 'ウルトラサン・ウルトラムーン',                min: 722, max: 809  },
  { value: 'lgpe', label: "Let's Go! ピカチュウ/イーブイ",               set: LGPE_SET       },
  { value: 'ss',   label: 'ソード・シールド',                            min: 810, max: 905  },
  { value: 'bdsp', label: 'ブリリアントダイヤモンド/シャイニングパール',  min: 1,   max: 493  },
  { value: 'pla',  label: 'レジェンズ アルセウス',                       set: HISUI_SET      },
  { value: 'sv',   label: 'スカーレット・バイオレット',                  min: 906, max: 1025 },
  { value: 'za',   label: 'レジェンズ Z-A',                              set: ZA_SET         },
];

// ─── Form lists (from shared @/lib/forms) ─────────────────────────────────────

const MEGA_LIST = MEGA_RAW.map((m) => ({
  id: m.baseId, spriteId: m.spriteId, name: m.jaName,
  jaName: m.jaName, isMega: true, isAlt: false,
  category: 'mega',
  megaKey: `mega-${m.baseId}-${m.spriteId}`,
}));

const ALT_FORM_LIST = ALT_FORM_RAW.map((m) => ({
  id: m.baseId, spriteId: m.spriteId, name: m.jaName,
  jaName: m.jaName, isMega: false, isAlt: true,
  category: formCategory(m.jaName),
  altKey: `alt-${m.baseId}-${m.spriteId}`,
}));

// ─── helpers ──────────────────────────────────────────────────────────────────

function visiblePages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total]);
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) set.add(i);
  return [...set].sort((a, b) => a - b);
}

function altBadge(jaName, category) {
  if (category === 'gmax') return 'キョダイ';
  if (jaName.startsWith('アローラ'))  return 'アロ';
  if (jaName.startsWith('ガラル'))    return 'ガラル';
  if (jaName.startsWith('ヒスイ'))    return 'ヒスイ';
  if (jaName.startsWith('パルデア'))  return 'パルデア';
  if (jaName.startsWith('ゲンシ'))    return 'ゲンシ';
  if (jaName.startsWith('ウルトラ'))  return 'ウルトラ';
  return '別姿';
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

const CHIP_STYLES = {
  amber:  { on: 'bg-amber-400/80  border-amber-300/70  text-amber-900 shadow-[0_4px_16px_rgba(251,191,36,0.35),inset_0_1px_0_rgba(255,255,255,0.7)]',  dot: 'bg-amber-600/80' },
  indigo: { on: 'bg-indigo-500/85 border-indigo-300/70 text-white      shadow-[0_4px_16px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]',  dot: 'bg-indigo-700/80' },
  teal:   { on: 'bg-teal-500/85   border-teal-300/70   text-white      shadow-[0_4px_16px_rgba(20,184,166,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]',  dot: 'bg-teal-700/80' },
  violet: { on: 'bg-violet-500/85 border-violet-300/70 text-white      shadow-[0_4px_16px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]',  dot: 'bg-violet-700/80' },
};

function FilterChip({ active, onClick, color, children }) {
  const s = CHIP_STYLES[color];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold select-none backdrop-blur-xl border transition-all active:scale-95
        ${active ? s.on : 'bg-white/55 border-white/70 text-gray-600 shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]'}`}
    >
      <span className={`w-[18px] h-[18px] rounded-md flex items-center justify-center shrink-0 transition-colors ${active ? s.dot : 'border-2 border-gray-300 bg-white/40'}`}>
        {active && <Check size={11} strokeWidth={3} className="text-white" />}
      </span>
      {children}
    </button>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function SearchClient({ list }) {
  const [query,       setQuery]       = useState('');
  const [region,      setRegion]      = useState('all');
  const [game,        setGame]        = useState('all');
  const [showMega,    setShowMega]    = useState(false);
  const [showGmax,    setShowGmax]    = useState(false);
  const [showRegion,  setShowRegion]  = useState(false);
  const [showOther,   setShowOther]   = useState(false);
  const [page,        setPage]        = useState(1);

  const anyFormFilter = showMega || showGmax || showRegion || showOther;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const regionFilter = REGIONS.find((r) => r.value === region);
    const gameFilter   = GAMES.find((g) => g.value === game);

    const inRange = (id) => {
      if (regionFilter?.value !== 'all') {
        if (id < regionFilter.min || id > regionFilter.max) return false;
      }
      if (gameFilter?.value !== 'all') {
        if (gameFilter.set) { if (!gameFilter.set.has(id)) return false; }
        else { if (id < gameFilter.min || id > gameFilter.max) return false; }
      }
      return true;
    };

    const matchQ = (jaName, name, id) =>
      !q || jaName.includes(q) || (name && name.includes(q)) || String(id).includes(q);

    const baseFiltered = list.filter((p) => matchQ(p.jaName, p.name, p.id) && inRange(p.id));
    const megaFiltered = MEGA_LIST.filter((p) => matchQ(p.jaName, '', p.id) && inRange(p.id));
    const altFiltered  = ALT_FORM_LIST.filter((p) => matchQ(p.jaName, '', p.id) && inRange(p.id));

    const combined = [...baseFiltered, ...megaFiltered, ...altFiltered].sort((a, b) => {
      if (a.id !== b.id) return a.id - b.id;
      if (!a.isMega && !a.isAlt && (b.isMega || b.isAlt)) return -1;
      if ((a.isMega || a.isAlt) && !b.isMega && !b.isAlt) return 1;
      if (a.isMega && !b.isMega) return -1;
      if (!a.isMega && b.isMega) return 1;
      return a.jaName.localeCompare(b.jaName, 'ja');
    });

    if (!anyFormFilter) return combined;

    return combined.filter((p) => {
      if (!p.isMega && !p.isAlt) return false;
      if (showMega   && p.category === 'mega')   return true;
      if (showGmax   && p.category === 'gmax')   return true;
      if (showRegion && p.category === 'region') return true;
      if (showOther  && p.category === 'other')  return true;
      return false;
    });
  }, [query, region, game, anyFormFilter, showMega, showGmax, showRegion, showOther, list]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset      = () => setPage(1);
  const pages      = visiblePages(page, totalPages);

  return (
    <div>
      {/* 検索 */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="名前またはNoで検索…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); reset(); }}
            className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-gray-700 placeholder:text-gray-400
                       bg-white/55 backdrop-blur-xl border border-white/70
                       shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]
                       outline-none focus:bg-white/75 transition-colors"
          />
        </div>
      </div>

      {/* プルダウン */}
      <div className="px-4 pb-3 flex gap-3">
        <GlassSelect value={region} onChange={(v) => { setRegion(v); reset(); }} options={REGIONS} label="地方" />
        <GlassSelect value={game}   onChange={(v) => { setGame(v);   reset(); }} options={GAMES}   label="ゲーム" />
      </div>

      {/* 絞り込みチップ */}
      <div className="px-4 pb-4 flex gap-2 flex-wrap">
        <FilterChip color="amber"  active={showMega}   onClick={() => { setShowMega(v   => !v); reset(); }}>メガシンカ</FilterChip>
        <FilterChip color="indigo" active={showGmax}   onClick={() => { setShowGmax(v   => !v); reset(); }}>キョダイマックス</FilterChip>
        <FilterChip color="teal"   active={showRegion} onClick={() => { setShowRegion(v => !v); reset(); }}>リージョンフォーム</FilterChip>
        <FilterChip color="violet" active={showOther}  onClick={() => { setShowOther(v  => !v); reset(); }}>その他のすがた</FilterChip>
      </div>

      {/* グリッド */}
      <div className="px-4 grid grid-cols-3 gap-3">
        {paginated.map((p) => {
          const isForm = p.isMega || p.isAlt;
          const imgId  = isForm ? p.spriteId : p.id;
          const href   = isForm ? `/pokemon/${p.spriteId}` : `/pokemon/${p.id}`;
          const noStr  = `No.${String(p.id).padStart(4, '0')}${p.isMega ? 'x' : ''}`;

          const badge = p.isMega ? { label: 'MEGA',   bg: 'bg-amber-400' }
                      : !p.isAlt ? null
                      : p.category === 'gmax'   ? { label: 'キョダイ', bg: 'bg-indigo-500' }
                      : p.category === 'region' ? { label: altBadge(p.jaName, p.category), bg: 'bg-teal-500' }
                      : { label: altBadge(p.jaName, p.category), bg: 'bg-violet-500' };

          const card = p.isMega               ? 'bg-amber-50/70  border-amber-200/70  shadow-[0_4px_16px_rgba(251,191,36,0.20),inset_0_1px_0_rgba(255,255,255,0.9)]'
                     : p.category === 'gmax'   ? 'bg-indigo-50/60 border-indigo-200/60 shadow-[0_4px_16px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]'
                     : p.category === 'region' ? 'bg-teal-50/60   border-teal-200/60   shadow-[0_4px_16px_rgba(20,184,166,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]'
                     : p.isAlt                 ? 'bg-violet-50/60 border-violet-200/60 shadow-[0_4px_16px_rgba(139,92,246,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]'
                     :                           'bg-white/55      border-white/70      shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.8)]';

          const noColor = p.isMega               ? 'text-amber-600'
                        : p.category === 'gmax'   ? 'text-indigo-500'
                        : p.category === 'region' ? 'text-teal-500'
                        : p.isAlt                 ? 'text-violet-500'
                        : 'text-gray-400';

          const key = p.isMega ? p.megaKey : p.isAlt ? p.altKey : p.id;

          return (
            <Link key={key} href={href}>
              <div className={`rounded-2xl p-2 text-center backdrop-blur-xl border active:scale-95 transition-transform duration-100 ${card}`}>
                <div className="relative w-full aspect-square">
                  <Image src={officialArtwork(imgId)} alt={p.jaName} fill className="object-contain drop-shadow" unoptimized />
                  {badge && (
                    <span className={`absolute top-0.5 right-0.5 text-[8px] font-black ${badge.bg} text-white px-1 py-0.5 rounded-full leading-none`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] font-mono mt-1 ${noColor}`}>{noStr}</p>
                <p className="text-xs font-bold text-gray-700 truncate">{p.jaName}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-white/80 text-sm py-10">該当なし</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 py-5 flex-wrap px-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 rounded-full bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] text-sm font-bold text-gray-600 disabled:opacity-40 active:scale-90 transition-transform">←</button>

          {pages.map((n, i) => (
            <Fragment key={n}>
              {i > 0 && pages[i - 1] !== n - 1 && <span className="text-white/80 text-sm w-5 text-center">…</span>}
              <button onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all active:scale-90 ${page === n ? 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.45)]' : 'bg-white/55 backdrop-blur-xl border border-white/70 text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]'}`}>
                {n}
              </button>
            </Fragment>
          ))}

          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 rounded-full bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] text-sm font-bold text-gray-600 disabled:opacity-40 active:scale-90 transition-transform">→</button>
        </div>
      )}
    </div>
  );
}
