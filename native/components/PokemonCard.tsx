import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { officialArtwork } from '../lib/pokeapi';

interface Props {
  id: number;
  spriteId?: number;
  jaName: string;
  isMega?: boolean;
  isAlt?: boolean;
  category?: string;
}

const CATEGORY_COLORS: Record<string, { card: string; no: string; badge: string; badgeBg: string }> = {
  mega:   { card: '#FEF9C3', no: '#D97706', badge: 'MEGA',    badgeBg: '#FBBF24' },
  gmax:   { card: '#EEF2FF', no: '#4F46E5', badge: 'キョダイ', badgeBg: '#6366F1' },
  region: { card: '#F0FDFA', no: '#0D9488', badge: 'リージョン', badgeBg: '#14B8A6' },
  other:  { card: '#F5F3FF', no: '#7C3AED', badge: '別姿',    badgeBg: '#8B5CF6' },
};

export default function PokemonCard({ id, spriteId, jaName, isMega, isAlt, category }: Props) {
  const router = useRouter();
  const imgId  = spriteId ?? id;
  const dest   = spriteId ? `/pokemon/${spriteId}` : `/pokemon/${id}`;
  const noStr  = `No.${String(id).padStart(4, '0')}${isMega ? 'x' : ''}`;
  const cat    = isMega ? 'mega' : (category ?? 'other');
  const colors = (isMega || isAlt) ? CATEGORY_COLORS[cat] : null;

  return (
    <Pressable
      onPress={() => router.push(dest as any)}
      className="rounded-2xl p-2 items-center active:scale-95"
      style={{ backgroundColor: colors?.card ?? 'rgba(255,255,255,0.85)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' }}
    >
      <View className="w-full aspect-square relative">
        <Image
          source={{ uri: officialArtwork(imgId) }}
          className="w-full h-full"
          resizeMode="contain"
        />
        {(isMega || isAlt) && colors && (
          <View className="absolute top-0.5 right-0.5 rounded-full px-1 py-0.5" style={{ backgroundColor: colors.badgeBg }}>
            <Text className="text-[8px] font-black text-white">{colors.badge}</Text>
          </View>
        )}
      </View>
      <Text className="text-[10px] font-mono mt-1" style={{ color: colors?.no ?? '#9CA3AF' }}>{noStr}</Text>
      <Text className="text-xs font-bold text-gray-800 text-center" numberOfLines={1}>{jaName}</Text>
    </Pressable>
  );
}
