import { TYPE_NAMES_JA, TYPE_COLORS } from '@/lib/pokeapi';

const SIZE = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
};

export default function TypeBadge({ type, size = 'sm' }) {
  return (
    <span
      className={`text-white font-bold rounded-full ${SIZE[size] ?? SIZE.sm}`}
      style={{ backgroundColor: TYPE_COLORS[type] ?? '#A8A878' }}
    >
      {TYPE_NAMES_JA[type] ?? type}
    </span>
  );
}
