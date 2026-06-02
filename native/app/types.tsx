import { View, Text, ScrollView, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TYPE_COLORS, TYPE_NAMES_JA } from '../lib/pokeapi';

const TYPES = Object.keys(TYPE_NAMES_JA);

// Effectiveness table (attack type → defending type → multiplier)
const EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fighting: 2, poison: 0.5, bug: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

function getEff(atk: string, def: string): number {
  return EFFECTIVENESS[atk]?.[def] ?? 1;
}

function effColor(v: number) {
  if (v === 0)   return '#9CA3AF';
  if (v === 0.25)return '#93C5FD';
  if (v === 0.5) return '#BFDBFE';
  if (v === 2)   return '#FCA5A5';
  if (v === 4)   return '#EF4444';
  return 'transparent';
}

function effLabel(v: number) {
  if (v === 0)   return '×0';
  if (v === 0.25)return '¼';
  if (v === 0.5) return '½';
  if (v === 2)   return '×2';
  if (v === 4)   return '×4';
  return '';
}

const CELL = 32;
const HEAD = 44;

export default function TypesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground source={require('../assets/icon.png')}
      className="flex-1" style={{ backgroundColor: '#f48a9c' }}>
      <View className="flex-1" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-black text-white text-center mb-4"
          style={{ textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
          タイプ相性表
        </Text>
        <Text className="text-white/80 text-xs text-center mb-3">縦＝攻撃　横＝防御</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {/* Header row */}
              <View style={{ flexDirection: 'row', marginLeft: HEAD }}>
                {TYPES.map(def => (
                  <View key={def} style={{ width: CELL, height: HEAD, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2 }}>
                    <Text style={{ fontSize: 7, fontWeight: '700', color: '#fff', transform: [{ rotate: '-60deg' }], width: 36, textAlign: 'center' }}>
                      {TYPE_NAMES_JA[def]}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Rows */}
              {TYPES.map(atk => (
                <View key={atk} style={{ flexDirection: 'row' }}>
                  <View style={{ width: HEAD, height: CELL, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 4 }}>
                    <View style={{ backgroundColor: TYPE_COLORS[atk], borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 8, fontWeight: '700', color: '#fff' }}>{TYPE_NAMES_JA[atk]}</Text>
                    </View>
                  </View>
                  {TYPES.map(def => {
                    const v = getEff(atk, def);
                    const bg = effColor(v);
                    return (
                      <View key={def} style={{ width: CELL, height: CELL, backgroundColor: bg === 'transparent' ? 'rgba(255,255,255,0.15)' : bg, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)' }}>
                        {v !== 1 && <Text style={{ fontSize: 8, fontWeight: '800', color: v === 0 || v >= 2 ? '#1F2937' : '#1E40AF' }}>{effLabel(v)}</Text>}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
