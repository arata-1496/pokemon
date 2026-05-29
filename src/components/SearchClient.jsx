'use client';
import { useState, useMemo, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Check, Sparkles } from 'lucide-react';
import { officialArtwork } from '@/lib/pokeapi';
import GlassSelect from '@/components/GlassSelect';

const PAGE_SIZE = 60;

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
  { value: 'rby',  label: '赤・緑・青',                                 min: 1,   max: 151  },
  { value: 'gsc',  label: '金・銀・クリスタル',                         min: 152, max: 251  },
  { value: 'rse',  label: 'ルビー・サファイア・エメラルド',             min: 252, max: 386  },
  { value: 'dppt', label: 'ダイヤモンド・パール・プラチナ',             min: 387, max: 493  },
  { value: 'hgss', label: 'ハートゴールド・ソウルシルバー',             min: 152, max: 251  },
  { value: 'bw',   label: 'ブラック・ホワイト',                         min: 494, max: 649  },
  { value: 'bw2',  label: 'ブラック2・ホワイト2',                       min: 494, max: 649  },
  { value: 'xy',   label: 'X・Y',                                       min: 650, max: 721  },
  { value: 'oras', label: 'オメガルビー・アルファサファイア',           min: 252, max: 386  },
  { value: 'sm',   label: 'サン・ムーン',                               min: 722, max: 809  },
  { value: 'usum', label: 'ウルトラサン・ウルトラムーン',               min: 722, max: 809  },
  { value: 'lgpe', label: "Let's Go! ピカチュウ/イーブイ",             min: 1,   max: 151  },
  { value: 'ss',   label: 'ソード・シールド',                           min: 810, max: 905  },
  { value: 'bdsp', label: 'ブリリアントダイヤモンド/シャイニングパール', min: 387, max: 493  },
  { value: 'pla',  label: 'レジェンズ アルセウス',                      min: 1,   max: 905  },
  { value: 'sv',   label: 'スカーレット・バイオレット',                 min: 906, max: 1025 },
];

// All Mega Evolution Pokémon. `spriteId` is the PokeAPI form id used to load
// the actual Mega artwork; `baseId` links to the base Pokémon's detail page.
const MEGA_LIST = [
  { baseId: 3,   spriteId: 10033, jaName: 'メガフシギバナ' },
  { baseId: 6,   spriteId: 10034, jaName: 'メガリザードンX' },
  { baseId: 6,   spriteId: 10035, jaName: 'メガリザードンY' },
  { baseId: 9,   spriteId: 10036, jaName: 'メガカメックス' },
  { baseId: 15,  spriteId: 10090, jaName: 'メガスピアー' },
  { baseId: 18,  spriteId: 10073, jaName: 'メガピジョット' },
  { baseId: 65,  spriteId: 10037, jaName: 'メガフーディン' },
  { baseId: 80,  spriteId: 10071, jaName: 'メガヤドラン' },
  { baseId: 94,  spriteId: 10038, jaName: 'メガゲンガー' },
  { baseId: 115, spriteId: 10039, jaName: 'メガガルーラ' },
  { baseId: 127, spriteId: 10040, jaName: 'メガカイロス' },
  { baseId: 130, spriteId: 10041, jaName: 'メガギャラドス' },
  { baseId: 142, spriteId: 10042, jaName: 'メガプテラ' },
  { baseId: 150, spriteId: 10043, jaName: 'メガミュウツーX' },
  { baseId: 150, spriteId: 10044, jaName: 'メガミュウツーY' },
  { baseId: 181, spriteId: 10045, jaName: 'メガデンリュウ' },
  { baseId: 208, spriteId: 10072, jaName: 'メガハガネール' },
  { baseId: 212, spriteId: 10046, jaName: 'メガハッサム' },
  { baseId: 214, spriteId: 10047, jaName: 'メガヘラクロス' },
  { baseId: 229, spriteId: 10048, jaName: 'メガヘルガー' },
  { baseId: 248, spriteId: 10049, jaName: 'メガバンギラス' },
  { baseId: 254, spriteId: 10065, jaName: 'メガジュカイン' },
  { baseId: 257, spriteId: 10050, jaName: 'メガバシャーモ' },
  { baseId: 260, spriteId: 10064, jaName: 'メガラグラージ' },
  { baseId: 282, spriteId: 10051, jaName: 'メガサーナイト' },
  { baseId: 302, spriteId: 10066, jaName: 'メガヤミラミ' },
  { baseId: 303, spriteId: 10052, jaName: 'メガクチート' },
  { baseId: 306, spriteId: 10053, jaName: 'メガボスゴドラ' },
  { baseId: 308, spriteId: 10054, jaName: 'メガチャーレム' },
  { baseId: 310, spriteId: 10055, jaName: 'メガライボルト' },
  { baseId: 319, spriteId: 10070, jaName: 'メガサメハダー' },
  { baseId: 323, spriteId: 10087, jaName: 'メガバクーダ' },
  { baseId: 334, spriteId: 10067, jaName: 'メガチルタリス' },
  { baseId: 354, spriteId: 10056, jaName: 'メガジュペッタ' },
  { baseId: 359, spriteId: 10057, jaName: 'メガアブソル' },
  { baseId: 362, spriteId: 10074, jaName: 'メガオニゴーリ' },
  { baseId: 373, spriteId: 10089, jaName: 'メガボーマンダ' },
  { baseId: 376, spriteId: 10076, jaName: 'メガメタグロス' },
  { baseId: 380, spriteId: 10062, jaName: 'メガラティアス' },
  { baseId: 381, spriteId: 10063, jaName: 'メガラティオス' },
  { baseId: 384, spriteId: 10079, jaName: 'メガレックウザ' },
  { baseId: 428, spriteId: 10088, jaName: 'メガミミロップ' },
  { baseId: 445, spriteId: 10058, jaName: 'メガガブリアス' },
  { baseId: 448, spriteId: 10059, jaName: 'メガルカリオ' },
  { baseId: 460, spriteId: 10060, jaName: 'メガユキノオー' },
  { baseId: 475, spriteId: 10068, jaName: 'メガエルレイド' },
  { baseId: 531, spriteId: 10069, jaName: 'メガタブンネ' },
  { baseId: 719, spriteId: 10075, jaName: 'メガディアンシー' },
].map((m) => ({
  id: m.baseId,
  spriteId: m.spriteId,
  name: m.jaName,
  jaName: m.jaName,
  isMega: true,
  megaKey: `${m.baseId}-${m.spriteId}`,
}));

function visiblePages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total]);
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) set.add(i);
  return [...set].sort((a, b) => a - b);
}

export default function SearchClient({ list }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [game, setGame] = useState('all');
  const [showMega, setShowMega] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const regionFilter = REGIONS.find((r) => r.value === region);
    const gameFilter   = GAMES.find((g) => g.value === game);

    const inRange = (id) => {
      if (regionFilter?.value !== 'all' && (id < regionFilter.min || id > regionFilter.max)) return false;
      if (gameFilter?.value   !== 'all' && (id < gameFilter.min   || id > gameFilter.max))   return false;
      return true;
    };

    const base = list.filter((p) => {
      if (q && !(p.jaName.includes(q) || p.name.includes(q) || String(p.id).includes(q))) return false;
      return inRange(p.id);
    });

    if (!showMega) return base;

    const megas = MEGA_LIST.filter((p) => {
      if (q && !(p.jaName.includes(q) || String(p.id).includes(q))) return false;
      return inRange(p.id);
    });

    return [...base, ...megas].sort((a, b) => {
      if (a.id !== b.id) return a.id - b.id;
      if (!a.isMega && b.isMega) return -1;
      if (a.isMega && !b.isMega) return 1;
      return a.jaName.localeCompare(b.jaName, 'ja');
    });
  }, [query, region, game, showMega, list]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => setPage(1);

  const pages = visiblePages(page, totalPages);

  return (
    <div>
      {/* 検索フィールド */}
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

      {/* メガシンカ チェックボックス */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => { setShowMega((v) => !v); reset(); }}
          className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-semibold select-none
                      transition-all active:scale-95
                      ${showMega
                        ? 'bg-amber-400/80 backdrop-blur-xl border border-amber-300/70 text-amber-900 shadow-[0_4px_16px_rgba(251,191,36,0.35),inset_0_1px_0_rgba(255,255,255,0.7)]'
                        : 'bg-white/55 backdrop-blur-xl border border-white/70 text-gray-600 shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]'
                      }`}
        >
          <span className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
            showMega ? 'bg-amber-600/80 border border-amber-500' : 'border-2 border-gray-300 bg-white/40'
          }`}>
            {showMega && <Check size={13} strokeWidth={3} className="text-white" />}
          </span>
          <Sparkles size={15} className={showMega ? 'text-amber-700' : 'text-gray-400'} />
          メガシンカを表示
        </button>
      </div>

      {/* グリッド */}
      <div className="px-4 grid grid-cols-3 gap-3">
        {paginated.map((p) => {
          const displayNo = `No.${String(p.id).padStart(4, '0')}${p.isMega ? 'x' : ''}`;
          return (
            <Link key={p.isMega ? p.megaKey : p.id} href={`/pokemon/${p.id}`}>
              <div className={`rounded-2xl p-2 text-center backdrop-blur-xl border active:scale-95 transition-transform duration-100
                ${p.isMega
                  ? 'bg-amber-50/70 border-amber-200/70 shadow-[0_4px_16px_rgba(251,191,36,0.20),inset_0_1px_0_rgba(255,255,255,0.9)]'
                  : 'bg-white/55 border-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.8)]'
                }`}
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={officialArtwork(p.isMega ? p.spriteId : p.id)}
                    alt={p.jaName}
                    fill
                    className="object-contain drop-shadow"
                    unoptimized
                  />
                  {p.isMega && (
                    <span className="absolute top-0.5 right-0.5 text-[8px] font-black bg-amber-400 text-white px-1 py-0.5 rounded-full leading-none">
                      MEGA
                    </span>
                  )}
                </div>
                <p className={`text-[10px] font-mono mt-1 ${p.isMega ? 'text-amber-600' : 'text-gray-400'}`}>
                  {displayNo}
                </p>
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
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-full bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] text-sm font-bold text-gray-600 disabled:opacity-40 active:scale-90 transition-transform"
          >
            ←
          </button>

          {pages.map((n, i) => (
            <Fragment key={n}>
              {i > 0 && pages[i - 1] !== n - 1 && (
                <span className="text-white/80 text-sm w-5 text-center">…</span>
              )}
              <button
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all active:scale-90 ${
                  page === n
                    ? 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.45)]'
                    : 'bg-white/55 backdrop-blur-xl border border-white/70 text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]'
                }`}
              >
                {n}
              </button>
            </Fragment>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 rounded-full bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] text-sm font-bold text-gray-600 disabled:opacity-40 active:scale-90 transition-transform"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
