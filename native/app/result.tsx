import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchPokemon, fetchSpecies, getJaName, getFlavorText, officialArtwork, shinyArtwork } from '../lib/pokeapi';
import TypeBadge from '../components/TypeBadge';

export default function ResultScreen() {
  const { id, ys, dn, raw } = useLocalSearchParams<{ id: string; ys: string; dn: string; raw: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [data,  setData]  = useState<any>(null);
  const [shiny, setShiny] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const numId = Number(id);
      const [pokemon, species] = await Promise.all([fetchPokemon(numId), fetchSpecies(numId)]);
      setData({ pokemon, species });
      setLoading(false);
    })();
  }, [id]);

  const numId   = Number(id);
  const formula = `(${ys} + ${dn} = ${raw}${Number(raw) > 1025 ? ` → ${raw} - 1025 = ${id}` : ''})`;

  return (
    <ScrollView className="flex-1 bg-pink-400"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }}>
      <View className="px-5">
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-white font-bold text-sm">← 戻る</Text>
        </Pressable>

        <Text className="text-white text-center font-black text-2xl mb-4"
          style={{ textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
          あなたのポケモン
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View className="bg-white rounded-3xl shadow-xl p-6 items-center">
            <Text className="text-gray-400 font-mono text-sm">
              No.{String(numId).padStart(4, '0')}
            </Text>
            <Image
              source={{ uri: shiny ? shinyArtwork(numId) : officialArtwork(numId) }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-black text-gray-800 mt-2">
              {getJaName(data?.species?.names ?? [])}
            </Text>
            <View className="flex-row gap-2 mt-2">
              {data?.pokemon?.types?.map((t: any) => (
                <TypeBadge key={t.type.name} type={t.type.name} size="md" />
              ))}
            </View>

            <Pressable onPress={() => setShiny(v => !v)}
              className={`mt-4 flex-row items-center gap-1.5 px-4 py-2 rounded-full ${shiny ? 'bg-yellow-400' : 'bg-gray-100'}`}>
              <Text>✨</Text>
              <Text className={`text-xs font-bold ${shiny ? 'text-yellow-900' : 'text-gray-500'}`}>
                {shiny ? '色違い表示中' : '色違いを見る'}
              </Text>
            </Pressable>

            {data?.species && (
              <Text className="text-gray-500 text-sm mt-4 leading-relaxed text-left w-full">
                {getFlavorText(data.species.flavor_text_entries)}
              </Text>
            )}

            <View className="mt-4 bg-gray-50 rounded-2xl p-3 w-full">
              <Text className="text-xs text-gray-400 text-center">{formula}</Text>
            </View>

            <Pressable onPress={() => router.push(`/pokemon/${numId}` as any)}
              className="mt-4 bg-red-500 rounded-2xl py-3 px-6">
              <Text className="text-white font-black">詳細を見る →</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
