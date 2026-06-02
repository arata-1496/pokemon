import { useMemo, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchPokemonList, fetchSpecies, getJaName, getIdFromUrl } from '../lib/pokeapi';
import { MEGA_RAW, ALT_FORM_RAW, formCategory } from '../lib/forms';
import PokemonCard from '../components/PokemonCard';

type Entry = { id: number; name: string; jaName: string; spriteId?: number; isMega?: boolean; isAlt?: boolean; category?: string };

const MEGA_LIST: Entry[] = MEGA_RAW.map((m: any) => ({
  id: m.baseId, spriteId: m.spriteId, name: m.jaName, jaName: m.jaName,
  isMega: true, isAlt: false, category: 'mega',
}));
const ALT_LIST: Entry[] = ALT_FORM_RAW.map((m: any) => ({
  id: m.baseId, spriteId: m.spriteId, name: m.jaName, jaName: m.jaName,
  isMega: false, isAlt: true, category: formCategory(m.jaName),
}));

const CHIPS = [
  { key: 'mega',   label: 'メガシンカ',       color: '#FBBF24', text: '#78350F' },
  { key: 'gmax',   label: 'キョダイマックス',  color: '#6366F1', text: '#fff' },
  { key: 'region', label: 'リージョンフォーム', color: '#14B8A6', text: '#fff' },
  { key: 'other',  label: 'その他のすがた',    color: '#8B5CF6', text: '#fff' },
] as const;

export default function SearchScreen() {
  const [baseList, setBaseList] = useState<Entry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [query,    setQuery]    = useState('');
  const [filters,  setFilters]  = useState<Set<string>>(new Set());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const data = await fetchPokemonList(1025, 0);
      const base = (data?.results ?? []).map((p: any) => ({ id: getIdFromUrl(p.url), name: p.name }));
      const results: any[] = new Array(base.length);
      let cursor = 0;
      async function worker() {
        while (cursor < base.length) {
          const i = cursor++;
          results[i] = await fetchSpecies(base[i].id);
        }
      }
      await Promise.all(Array.from({ length: 40 }, worker));
      setBaseList(base.map((p: any, i: number) => ({
        ...p, jaName: getJaName(results[i]?.names ?? []) || p.name,
      })));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchQ = (jaName: string, name: string, id: number) =>
      !q || jaName.includes(q) || name.includes(q) || String(id).includes(q);

    const base = baseList.filter(p => matchQ(p.jaName, p.name, p.id));
    const mega = MEGA_LIST.filter(p => matchQ(p.jaName, '', p.id));
    const alt  = ALT_LIST.filter(p  => matchQ(p.jaName, '', p.id));

    const combined = [...base, ...mega, ...alt].sort((a, b) => {
      if (a.id !== b.id) return a.id - b.id;
      if (!a.isMega && !a.isAlt && (b.isMega || b.isAlt)) return -1;
      if (a.isMega && !b.isMega) return -1;
      return 0;
    });

    if (filters.size === 0) return combined;
    return combined.filter(p => {
      if (!p.isMega && !p.isAlt) return false;
      return filters.has(p.category ?? '');
    });
  }, [baseList, query, filters]);

  function toggleFilter(key: string) {
    setFilters(prev => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  }

  return (
    <ImageBackground source={require('../assets/icon.png')}
      className="flex-1" style={{ backgroundColor: '#f48a9c' }}>
      <View className="flex-1" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-black text-white text-center mb-4"
          style={{ textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
          詳細検索
        </Text>

        <View className="px-4 mb-3">
          <TextInput value={query} onChangeText={setQuery}
            placeholder="名前またはNoで検索…" placeholderTextColor="#9CA3AF"
            className="bg-white/80 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}>
          {CHIPS.map(chip => {
            const active = filters.has(chip.key);
            return (
              <Pressable key={chip.key} onPress={() => toggleFilter(chip.key)}
                className="flex-row items-center gap-1.5 rounded-2xl px-4 py-2.5"
                style={{ backgroundColor: active ? chip.color : 'rgba(255,255,255,0.7)' }}>
                <Text className="text-xs font-bold" style={{ color: active ? chip.text : '#6B7280' }}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" className="mt-10" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={p => p.isMega ? `mega-${p.id}-${p.spriteId}` : p.isAlt ? `alt-${p.id}-${p.spriteId}` : String(p.id)}
            numColumns={3}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 100, gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item: p }) => (
              <View style={{ flex: 1 }}>
                <PokemonCard
                  id={p.id} spriteId={p.spriteId} jaName={p.jaName}
                  isMega={p.isMega} isAlt={p.isAlt} category={p.category}
                />
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}
