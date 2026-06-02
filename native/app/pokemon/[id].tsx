import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fetchPokemon, fetchSpecies, fetchType, fetchAbility, fetchEvolution,
  getJaName, getFlavorText, getIdFromUrl, officialArtwork, shinyArtwork,
  calcTypeMatchup, addNamesToChain, collectChainIds, getEvoCondition,
  TYPE_NAMES_JA, STAT_NAMES_JA, DAMAGE_CLASS_JA,
} from '../../lib/pokeapi';
import { getFormInfo, getMegasForBase } from '../../lib/forms';
import TypeBadge from '../../components/TypeBadge';

export default function PokemonDetail() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const numId   = Number(id);
  const formInfo = getFormInfo(numId);
  const isForm  = !!formInfo;
  const baseId  = isForm ? formInfo.baseId : numId;

  const [poke,    setPoke]    = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [evoTree, setEvoTree] = useState<any>(null);
  const [matchup, setMatchup] = useState<Record<string, number>>({});
  const [shiny,   setShiny]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPoke(null); setSpecies(null); setEvoTree(null); setMatchup({});
    (async () => {
      const [pokemon, sp] = await Promise.all([fetchPokemon(numId), fetchSpecies(baseId)]);
      setPoke(pokemon);
      setSpecies(sp);

      if (pokemon?.types) {
        const typeData = await Promise.all(pokemon.types.map((t: any) => fetchType(t.type.name)));
        setMatchup(calcTypeMatchup(typeData.filter(Boolean)));
      }

      if (sp?.evolution_chain?.url) {
        const evo = await fetchEvolution(sp.evolution_chain.url);
        if (evo) {
          const ids = collectChainIds(evo.chain);
          const sps = await Promise.all(ids.map((cid: number) => fetchSpecies(cid)));
          const nameMap = Object.fromEntries(ids.map((cid: number, i: number) => [cid, getJaName(sps[i]?.names ?? [])]));
          setEvoTree(addNamesToChain(evo.chain, nameMap));
        }
      }
      setLoading(false);
    })();
  }, [numId]);

  const jaName = isForm ? formInfo.jaName : getJaName(species?.names ?? []);
  const types  = poke?.types ?? [];

  const BADGE_LABEL: Record<string, string> = { mega: 'MEGA', gmax: 'キョダイマックス', region: 'リージョンフォーム', other: '別のすがた' };
  const BADGE_COLOR: Record<string, string> = { mega: '#FBBF24', gmax: '#6366F1', region: '#14B8A6', other: '#8B5CF6' };

  function renderMatchupRow(label: string, keys: string[], color: string) {
    if (keys.length === 0) return null;
    return (
      <View className="flex-row items-start gap-2 mb-2">
        <Text className="text-xs font-bold w-14 mt-0.5" style={{ color }}>{label}</Text>
        <View className="flex-row flex-wrap gap-1">
          {keys.map(t => <TypeBadge key={t} type={t} size="xs" />)}
        </View>
      </View>
    );
  }

  function renderEvoNode(node: any, depth = 0): React.ReactNode {
    if (!node) return null;
    const condition = node.details?.[0] ? getEvoCondition(node.details[0]) : null;
    const megas = getMegasForBase(node.id);
    return (
      <View key={node.id} className="items-center">
        {condition && (
          <View className="items-center my-1">
            <Text className="text-gray-300 text-base">↓</Text>
            <View className="bg-gray-50 rounded-full px-2 py-0.5">
              <Text className="text-xs text-gray-400">{condition}</Text>
            </View>
          </View>
        )}
        <Pressable onPress={() => router.push(`/pokemon/${node.id}` as any)}>
          <View className={`items-center px-3 py-2 rounded-2xl ${node.id === baseId ? 'bg-red-50 border-2 border-red-300' : ''}`}>
            <Image source={{ uri: officialArtwork(node.id) }} style={{ width: 64, height: 64 }} resizeMode="contain" />
            <Text className="text-xs font-bold text-gray-700 mt-1">{node.jaName || node.name}</Text>
          </View>
        </Pressable>
        {node.evolvesTo?.length > 0 && (
          <View className="flex-row flex-wrap justify-center gap-2 mt-1">
            {node.evolvesTo.map((child: any) => renderEvoNode(child, depth + 1))}
          </View>
        )}
        {megas.length > 0 && (
          <View className="flex-row flex-wrap justify-center gap-2 mt-1">
            {megas.map((m: any) => (
              <View key={m.spriteId} className="items-center">
                <View className="items-center my-1">
                  <Text className="text-amber-300 text-base">↓</Text>
                  <View className="bg-amber-50 rounded-full px-2 py-0.5">
                    <Text className="text-xs text-amber-600">メガシンカ</Text>
                  </View>
                </View>
                <Pressable onPress={() => router.push(`/pokemon/${m.spriteId}` as any)}>
                  <View className="items-center px-3 py-2 rounded-2xl bg-amber-50">
                    <Image source={{ uri: officialArtwork(m.spriteId) }} style={{ width: 64, height: 64 }} resizeMode="contain" />
                    <Text className="text-xs font-bold text-amber-700 mt-1">{m.jaName}</Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: '#f48a9c' }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }}>
      <View className="px-4">
        <View className="flex-row justify-between items-center mb-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-white font-bold text-sm">← 戻る</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            {/* ヘッダーカード */}
            <View className="bg-white rounded-3xl shadow-xl p-5 items-center mb-4">
              <Text className="text-gray-400 font-mono text-sm">No.{String(baseId).padStart(4, '0')}</Text>
              {isForm && formInfo && (
                <View className="rounded-full px-3 py-1 mt-1 mb-1"
                  style={{ backgroundColor: BADGE_COLOR[formInfo.category] }}>
                  <Text className="text-xs font-black text-white">{BADGE_LABEL[formInfo.category]}</Text>
                </View>
              )}
              <Image
                source={{ uri: shiny ? shinyArtwork(numId) : officialArtwork(numId) }}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
              <Text className="text-3xl font-black text-gray-800 mt-2">{jaName}</Text>
              <View className="flex-row gap-2 mt-2">
                {types.map((t: any) => <TypeBadge key={t.type.name} type={t.type.name} size="md" />)}
              </View>
              <Pressable onPress={() => setShiny(v => !v)}
                className={`flex-row items-center gap-1.5 mt-3 px-4 py-2 rounded-full ${shiny ? 'bg-yellow-400' : 'bg-gray-100'}`}>
                <Text>✨</Text>
                <Text className={`text-xs font-bold ${shiny ? 'text-yellow-900' : 'text-gray-500'}`}>
                  {shiny ? '色違い表示中' : '色違いを見る'}
                </Text>
              </Pressable>
              {isForm && (
                <Pressable onPress={() => router.push(`/pokemon/${baseId}` as any)}
                  className="mt-3 bg-gray-100 rounded-full px-3 py-1">
                  <Text className="text-xs text-gray-500">← ベースフォルムへ</Text>
                </Pressable>
              )}
              {!isForm && species && (
                <Text className="text-gray-500 text-sm mt-3 leading-relaxed">
                  {getFlavorText(species.flavor_text_entries)}
                </Text>
              )}
            </View>

            {/* 基本情報 */}
            {poke && (
              <View className="bg-white rounded-3xl shadow-xl p-5 mb-4">
                <Text className="text-sm font-black text-gray-600 tracking-wide mb-3">基本情報</Text>
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 bg-gray-50 rounded-2xl p-3 items-center">
                    <Text className="text-xs text-gray-400 mb-1">たかさ</Text>
                    <Text className="text-xl font-bold text-gray-700">{(poke.height / 10).toFixed(1)} m</Text>
                  </View>
                  <View className="flex-1 bg-gray-50 rounded-2xl p-3 items-center">
                    <Text className="text-xs text-gray-400 mb-1">おもさ</Text>
                    <Text className="text-xl font-bold text-gray-700">{(poke.weight / 10).toFixed(1)} kg</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-400 mb-2">とくせい</Text>
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {poke.abilities.map((a: any) => (
                    <View key={a.ability.name}
                      className={`px-3 py-1 rounded-full ${a.is_hidden ? 'bg-purple-100 border border-purple-200' : 'bg-gray-100'}`}>
                      <Text className={`text-sm font-medium ${a.is_hidden ? 'text-purple-700' : 'text-gray-700'}`}>
                        {a.ability.name}{a.is_hidden ? ' (かくれ)' : ''}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text className="text-xs text-gray-400 mb-2">基本ステータス</Text>
                {poke.stats.map((s: any) => {
                  const pct = Math.min(100, Math.round((s.base_stat / 255) * 100));
                  const color = s.base_stat < 50 ? '#f87171' : s.base_stat < 80 ? '#fb923c' : s.base_stat < 110 ? '#4ade80' : '#34d399';
                  return (
                    <View key={s.stat.name} className="flex-row items-center gap-2 mb-1.5">
                      <Text className="text-xs text-gray-500 w-16 text-right">{STAT_NAMES_JA[s.stat.name] ?? s.stat.name}</Text>
                      <Text className="text-xs font-bold text-gray-700 w-7 text-right">{s.base_stat}</Text>
                      <View className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <View style={{ width: `${pct}%`, backgroundColor: color, height: '100%', borderRadius: 999 }} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* タイプ相性 */}
            <View className="bg-white rounded-3xl shadow-xl p-5 mb-4">
              <Text className="text-sm font-black text-gray-600 tracking-wide mb-3">タイプ相性</Text>
              {renderMatchupRow('×4 弱点', Object.entries(matchup).filter(([,v]) => v === 4).map(([k]) => k), '#dc2626')}
              {renderMatchupRow('×2 弱点', Object.entries(matchup).filter(([,v]) => v === 2).map(([k]) => k), '#f87171')}
              {renderMatchupRow('×½ 耐性', Object.entries(matchup).filter(([,v]) => v === 0.5).map(([k]) => k), '#60a5fa')}
              {renderMatchupRow('×¼ 耐性', Object.entries(matchup).filter(([,v]) => v === 0.25).map(([k]) => k), '#2563eb')}
              {renderMatchupRow('×0 無効', Object.entries(matchup).filter(([,v]) => v === 0).map(([k]) => k), '#9ca3af')}
            </View>

            {/* 進化 */}
            {evoTree && (
              <View className="bg-white rounded-3xl shadow-xl p-5 mb-4">
                <Text className="text-sm font-black text-gray-600 tracking-wide mb-3">進化</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {renderEvoNode(evoTree)}
                </ScrollView>
              </View>
            )}

            {/* 前後ナビ */}
            {!isForm && (
              <View className="flex-row gap-3">
                {baseId > 1 && (
                  <Pressable onPress={() => router.replace(`/pokemon/${baseId - 1}` as any)}
                    className="flex-1 bg-white rounded-2xl py-3 items-center shadow">
                    <Text className="text-gray-600 font-bold text-sm">← No.{String(baseId - 1).padStart(4, '0')}</Text>
                  </Pressable>
                )}
                {baseId < 1025 && (
                  <Pressable onPress={() => router.replace(`/pokemon/${baseId + 1}` as any)}
                    className="flex-1 bg-white rounded-2xl py-3 items-center shadow">
                    <Text className="text-gray-600 font-bold text-sm">No.{String(baseId + 1).padStart(4, '0')} →</Text>
                  </Pressable>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
