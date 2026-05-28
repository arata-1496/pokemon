'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { officialArtwork } from '@/lib/pokeapi';

const PAGE_SIZE = 60;

export default function PokedexSearch({ list }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) => p.name.includes(q) || String(p.id).includes(q)
    );
  }, [query, list]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

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
                  alt={p.name}
                  fill
                  className="object-contain drop-shadow"
                  unoptimized
                />
              </div>
              <p className="text-[10px] text-gray-400 font-mono mt-1">
                No.{String(p.id).padStart(4, '0')}
              </p>
              <p className="text-xs font-bold text-gray-700 truncate">{p.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-white/80 text-sm py-10">該当なし</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white rounded-xl shadow text-sm font-bold text-gray-600 disabled:opacity-40"
          >
            ←
          </button>
          <span className="text-white text-sm font-bold">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white rounded-xl shadow text-sm font-bold text-gray-600 disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
