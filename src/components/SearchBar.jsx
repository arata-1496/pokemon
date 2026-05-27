'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const query = value.trim();
      if (query) {
        router.push(`/?q=${encodeURIComponent(query)}`);
      } else {
        router.push('/');
      }
    },
    [value, router]
  );

  const handleClear = () => {
    setValue('');
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md mx-auto">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ポケモンの名前または番号を入力..."
          className="w-full px-4 py-2 pr-8 rounded-full border-2 border-red-300 focus:border-red-500 focus:outline-none bg-white text-gray-800 placeholder-gray-400"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-bold transition-colors"
      >
        検索
      </button>
    </form>
  );
}
