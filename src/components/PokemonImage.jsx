'use client';
import { useState } from 'react';
import Image from 'next/image';
import { officialArtwork, shinyArtwork } from '@/lib/pokeapi';

export default function PokemonImage({ id, alt }) {
  const [shiny, setShiny] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative mx-auto" style={{ width: '100%', maxWidth: 220, aspectRatio: '1' }}>
        <Image
          key={shiny ? 'shiny' : 'normal'}
          src={shiny ? shinyArtwork(id) : officialArtwork(id)}
          alt={alt}
          fill
          priority
          className="object-contain drop-shadow-xl transition-opacity duration-200"
          unoptimized
        />
        {shiny && (
          <span className="absolute top-1 left-1 text-base select-none">✨</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => setShiny((v) => !v)}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95
          ${shiny
            ? 'bg-yellow-400/90 text-yellow-900 shadow-[0_2px_10px_rgba(234,179,8,0.4)]'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
      >
        <span>✨</span>
        {shiny ? '色違い表示中' : '色違いを見る'}
      </button>
    </div>
  );
}
