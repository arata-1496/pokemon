'use client';
import { useState } from 'react';

export default function AbilityChip({ jaName, jaEffect, isHidden }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-left transition-colors active:scale-95 ${
          isHidden
            ? 'bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <span>{jaName}</span>
        {isHidden && <span className="text-xs opacity-70">(かくれ)</span>}
        {jaEffect && (
          <span className={`text-[10px] ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        )}
      </button>
      {open && jaEffect && (
        <div className={`text-xs leading-relaxed px-3 py-2 rounded-2xl ${
          isHidden ? 'bg-purple-50 text-purple-800' : 'bg-gray-50 text-gray-600'
        }`}>
          {jaEffect}
        </div>
      )}
    </div>
  );
}
