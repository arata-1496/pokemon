'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function GlassSelect({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700
                   bg-white/55 backdrop-blur-xl border border-white/70
                   shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]
                   active:scale-[0.98] transition-transform duration-150"
      >
        <span className="truncate">{selected?.label ?? label}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto p-1.5
                     rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/70
                     shadow-[0_12px_40px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.9)]
                     animate-[glassIn_0.18s_ease-out]"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-sm text-left transition-colors ${
                  active
                    ? 'bg-red-500/90 text-white font-bold shadow-sm'
                    : 'text-gray-700 font-medium hover:bg-white/70 active:bg-white/70'
                }`}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check size={16} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
