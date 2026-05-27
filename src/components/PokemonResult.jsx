'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PokemonResult({ id, yearSuffix, dateNum, raw }) {
  const [pokemon, setPokemon] = useState(null);
  const [jaName, setJaName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const jaEntry = speciesData.names.find(n => n.language.name === 'ja-Hrkt');

        setPokemon(data);
        setJaName(jaEntry?.name ?? data.name);
      } catch {
        setError('ポケモンの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
        <div className="w-14 h-14 border-4 border-red-100 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">ポケモンを探しています...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
        <p className="text-5xl mb-3">😢</p>
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  const sprite =
    pokemon?.sprites?.other?.['official-artwork']?.front_default ??
    pokemon?.sprites?.front_default;

  return (
    <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
      {/* Calculation */}
      <p className="text-xs text-gray-300 font-mono">
        {yearSuffix} + {dateNum} = {raw}
        {raw > 1025 && (
          <span>
            {' '}→ {raw} − 1025 ={' '}
            <span className="text-gray-500 font-bold">{id}</span>
          </span>
        )}
      </p>
      <p className="text-sm text-gray-400 font-mono mt-1 mb-3">
        No.{String(id).padStart(4, '0')}
      </p>

      <p className="text-xs text-gray-400 mb-4">あなたのポケモンは…</p>

      {sprite && (
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={sprite}
            alt={jaName}
            fill
            className="object-contain drop-shadow-2xl"
            unoptimized
          />
        </div>
      )}

      <h2 className="text-4xl font-black text-gray-800 mt-4 tracking-tight">{jaName}</h2>
      <p className="text-sm text-gray-300 mt-1">{pokemon?.name}</p>
    </div>
  );
}
