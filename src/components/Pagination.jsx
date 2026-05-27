'use client';

import { useRouter } from 'next/navigation';

export default function Pagination({ page, totalPages }) {
  const router = useRouter();

  const go = (p) => router.push(`/?page=${p}`);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => go(1)}
        disabled={page <= 1}
        className="px-3 py-1 rounded-lg bg-white border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-sm"
      >
        «
      </button>
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 rounded-lg bg-white border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-sm"
      >
        ‹ 前へ
      </button>
      <span className="px-4 py-1 text-sm text-gray-600">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded-lg bg-white border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-sm"
      >
        次へ ›
      </button>
      <button
        onClick={() => go(totalPages)}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded-lg bg-white border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-sm"
      >
        »
      </button>
    </div>
  );
}
