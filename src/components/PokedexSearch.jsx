'use client';
import { useState, useMemo, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { officialArtwork } from '@/lib/pokeapi';

const PAGE_SIZE = 60;

function visiblePages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total]);
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) set.add(i);
  return [...set].sort((a, b) => a - b);
}

export default function PokedexSearch({ list }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) => p.jaName.includes(q) || p.name.includes(q) || String(p.id).includes(q)
    );
  }, [query, list]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const pages = visiblePages(page, totalPages);

  return (
    <div>
      <div className="px-4 pb-3">
        <input
          type="search"
          placeholder="名前またはNoで検索…"
          value={query}
          onChange={handleSearch}
          className="w-full bg-white rounded-2xl px-4 py-3 text-sm shadow outline-none"
        />
      </div>

      <div className="px-4 grid grid-cols-3 gap-3">
        {paginated.map((p) => (
          <Link key={p.id} href={`/pokemon/${p.id}`}>
            <div className="bg-white rounded-2xl p-2 text-center shadow active:scale-95 transition-transform duration-100">
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
            className="w-9 h-9 bg-white rounded-xl shadow text-sm font-bold text-gray-600 disabled:opacity-40"
          >
            ←
          </button>

          {pages.map((n, i) => (
            <Fragment key={n}>
              {i > 0 && pages[i - 1] !== n - 1 && (
                <span className="text-white/70 text-sm w-5 text-center">…</span>
              )}
              <button
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-xl shadow text-sm font-bold transition-colors ${
                  page === n
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {n}
              </button>
            </Fragment>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 bg-white rounded-xl shadow text-sm font-bold text-gray-600 disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
