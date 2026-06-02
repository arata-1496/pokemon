import { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchPokemonList, fetchSpecies, getJaName, getIdFromUrl } from '../lib/pokeapi';
import PokemonCard from '../components/PokemonCard';

type Entry = { id: number; name: string; jaName: string };

export default function PokedexScreen() {
  const [list,    setList]    = useState<Entry[]>([]);
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const data = await fetchPokemonList(1025, 0);
      const base: { id: number; name: string }[] = (data?.results ?? []).map((p: any) => ({
        id: getIdFromUrl(p.url), name: p.name,
      }));
      // Fetch species in batches of 40
      const results: any[] = new Array(base.length);
      let cursor = 0;
      async function worker() {
        while (cursor < base.length) {
          const i = cursor++;
          results[i] = await fetchSpecies(base[i].id);
        }
      }
      const workers = Array.from({ length: 40 }, worker);
      await Promise.all(workers);
      setList(base.map((p, i) => ({
        ...p,
        jaName: getJaName(results[i]?.names ?? []) || p.name,
      })));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(p =>
      p.jaName.includes(q) || p.name.includes(q) || String(p.id).includes(q)
    );
  }, [list, query]);

  return (
    <ImageBackground source={require('../assets/icon.png')}
      className="flex-1" style={{ backgroundColor: '#f48a9c' }}>
      <View className="flex-1" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-black text-white text-center mb-4"
          style={{ textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
          ポケモン図鑑
        </Text>

        <View className="px-4 mb-3">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="名前またはNoで検索…"
            placeholderTextColor="#9CA3AF"
            className="bg-white/80 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" className="mt-10" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={p => String(p.id)}
            numColumns={3}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 100, gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item: p }) => (
              <View style={{ flex: 1 }}>
                <PokemonCard id={p.id} jaName={p.jaName} />
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}
