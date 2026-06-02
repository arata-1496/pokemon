import { View, Text } from 'react-native';
import { TYPE_COLORS, TYPE_NAMES_JA } from '../lib/pokeapi';

type Size = 'xs' | 'sm' | 'md';

export default function TypeBadge({ type, size = 'sm' }: { type: string; size?: Size }) {
  const color = TYPE_COLORS[type] ?? '#999';
  const label = TYPE_NAMES_JA[type] ?? type;
  const pad   = size === 'xs' ? 'px-1.5 py-0.5' : size === 'md' ? 'px-4 py-1.5' : 'px-2.5 py-1';
  const text  = size === 'xs' ? 'text-[10px]' : size === 'md' ? 'text-sm' : 'text-xs';
  return (
    <View className={`rounded-full ${pad}`} style={{ backgroundColor: color }}>
      <Text className={`${text} font-bold text-white`}>{label}</Text>
    </View>
  );
}
