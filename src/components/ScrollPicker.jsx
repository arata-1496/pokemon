'use client';
import { useRef, useEffect, useCallback } from 'react';

const ITEM_HEIGHT = 64;

export default function ScrollPicker({ items, value, onChange, width = 72 }) {
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const idx = items.findIndex(item => item.value === value);
    if (idx >= 0 && containerRef.current) {
      containerRef.current.scrollTop = idx * ITEM_HEIGHT;
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      const idx = Math.round(containerRef.current.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      if (items[clamped]) onChange(items[clamped].value);
    }, 150);
  }, [items, onChange]);

  return (
    <div className="relative overflow-hidden" style={{ height: ITEM_HEIGHT * 3, width }}>
      {/* Center selection band */}
      <div
        className="absolute left-0 right-0 border-y-2 border-red-400 bg-red-50"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT, zIndex: 1 }}
      />
      {/* Scrollable list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-scroll no-scrollbar"
        style={{ scrollSnapType: 'y mandatory', zIndex: 2, touchAction: 'pan-y' }}
      >
        <div style={{ height: ITEM_HEIGHT }} />
        {items.map((item) => (
          <div
            key={item.value}
            style={{ height: ITEM_HEIGHT, scrollSnapAlign: 'center' }}
            className={`flex items-center justify-center text-2xl font-bold select-none
              ${item.value === value ? 'text-gray-800' : 'text-gray-400'}`}
          >
            {item.label}
          </div>
        ))}
        <div style={{ height: ITEM_HEIGHT }} />
      </div>
      {/* Fade gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background:
            'linear-gradient(to bottom, white 0%, transparent 33%, transparent 67%, white 100%)',
        }}
      />
    </div>
  );
}
