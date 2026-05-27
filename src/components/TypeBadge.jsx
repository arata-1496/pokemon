import { TYPE_COLORS, TYPE_NAMES_JA } from '@/lib/pokeapi';

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] ?? 'bg-gray-400';
  const label = TYPE_NAMES_JA[type] ?? type;
  return (
    <span className={`${color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
      {label}
    </span>
  );
}
