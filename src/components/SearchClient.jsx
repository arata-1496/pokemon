'use client';
import { useState, useMemo, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
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
  { value: 'rby',  label: '赤・緑・青',                       min: 1,   max: 151  },
  { value: 'gsc',  label: '金・銀・クリスタル',               min: 152, max: 251  },
  { value: 'rse',  label: 'ルビー・サファイア・エメラルド',   min: 252, max: 386  },
  { value: 'dppt', label: 'ダイヤモンド・パール・プラチナ',   min: 387, max: 493  },
  { value: 'hgss', label: 'ハートゴールド・ソウルシルバー',   min: 152, max: 251  },
  { value: 'bw',   label: 'ブラック・ホワイト',               min: 494, max: 649  },
  { value: 'bw2',  label: 'ブラック2・ホワイト2',             min: 494, max: 649  },
  { value: 'xy',   label: 'X・Y',                             min: 650, max: 721  },
  { value: 'oras', label: 'オメガルビー・アルファサファイア', min: 252, max: 386  },
  { value: 'sm',   label: 'サン・ムーン',                     min: 722, max: 809  },
  { value: 'usum', label: 'ウルトラサン・ウルトラムーン',     min: 722, max: 809  },
  { value: 'ss',   label: 'ソード・シールド',                 min: 810, max: 905  },
  { value: 'sv',   label: 'スカーレット・バイオレット',       min: 906, max: 1025 },
];

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
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const regionFilter = REGIONS.find((r) => r.value === region);
    const gameFilter = GAMES.find((g) => g.value === game);

    return list.filter((p) => {
      if (q && !(p.jaName.includes(q) || p.name.includes(q) || String(p.id).includes(q))) {
        return false;
      }
      if (regionFilter && regionFilter.value !== 'all') {
        if (p.id < regionFilter.min || p.id > regionFilter.max) return false;
      }
      if (gameFilter && gameFilter.value !== 'all') {
        if (p.id < gameFilter.min || p.id > gameFilter.max) return false;
      }
      return true;
    });
  }, [query, region, game, list]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleRegion = (v) => {
    setRegion(v);
    setPage(1);
  };

  const handleGame = (v) => {
    setGame(v);
    setPage(1);
  };

  const pages = visiblePages(page, totalPages);

  return (
    <div>
      <div className="px-4 pb-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="名前またはNoで検索…"
            value={query}
            onChange={handleSearch}
            className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-gray-700 placeholder:text-gray-400
                       bg-white/55 backdrop-blur-xl border border-white/70
                       shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]
                       outline-none focus:bg-white/75 transition-colors"
          />
        </div>
      </div>

      <div className="px-4 pb-4 flex gap-3">
        <GlassSelect value={region} onChange={handleRegion} options={REGIONS} label="地方" />
        <GlassSelect value={game} onChange={handleGame} options={GAMES} label="ゲーム" />
      </div>

      <div className="px-4 grid grid-cols-3 gap-3">
        {paginated.map((p) => (
          <Link key={p.id} href={`/pokemon/${p.id}`}>
            <div className="rounded-2xl p-2 text-center bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.8)] active:scale-95 transition-transform duration-100">
              <div className="relative w-full aspect-square">
                <Image
                  src={officialArtwork(p.id)}
                  alt={p.jaName}
                  fill
                  className="object-contain drop-shadow"
                  unoptimized
                />
              </div>
              <p className="text-[10px] text-gray-400 font-mono mt-1">
                No.{String(p.id).padStart(4, '0')}
              </p>
              <p className="text-xs font-bold text-gray-700 truncate">{p.jaName}</p>
            </div>
          </Link>
        ))}
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
