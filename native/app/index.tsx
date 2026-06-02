import { useState } from 'react';
import { View, Text, Pressable, ScrollView, ImageBackground, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const YEARS  = Array.from({ length: 2025 - 1940 + 1 }, (_, i) => 1940 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1);

function NumberPicker({ values, selected, onChange, label, width = 80 }:
  { values: number[]; selected: number; onChange: (v: number) => void; label: string; width?: number }) {
  const ITEM_H = 44;
  const VISIBLE = 5;
  const idx = values.indexOf(selected);

  return (
    <View style={{ width }} className="items-center">
      <View style={{ height: ITEM_H * VISIBLE, overflow: 'hidden' }} className="relative">
        {/* center indicator */}
        <View className="absolute left-0 right-0 z-10 border-y border-gray-200 pointer-events-none"
          style={{ top: ITEM_H * 2, height: ITEM_H }} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_H}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
            onChange(values[Math.max(0, Math.min(i, values.length - 1))]);
          }}
          contentOffset={{ x: 0, y: idx * ITEM_H }}
        >
          {values.map((v) => (
            <Pressable key={v} style={{ height: ITEM_H }} className="items-center justify-center"
              onPress={() => onChange(v)}>
              <Text className={`text-xl font-bold ${v === selected ? 'text-gray-800' : 'text-gray-300'}`}>
                {v}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <Text className="text-xs font-semibold text-gray-400 mt-1">{label}</Text>
    </View>
  );
}

function calcPokemonId(year: number, month: number, day: number) {
  const yearSuffix = year % 100;
  const dateNum    = month * 100 + day;
  const raw        = yearSuffix + dateNum;
  const id         = raw > 1025 ? raw - 1025 : raw;
  return { id, yearSuffix, dateNum, raw };
}

export default function HomeScreen() {
  const [year,  setYear]  = useState(1990);
  const [month, setMonth] = useState(2);
  const [day,   setDay]   = useState(13);
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const scale   = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handleStart() {
    scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
    const { id, yearSuffix, dateNum, raw } = calcPokemonId(year, month, day);
    router.push({ pathname: '/result', params: { id, ys: yearSuffix, dn: dateNum, raw } });
  }

  return (
    <ImageBackground
      source={require('../assets/icon.png')}
      className="flex-1"
      style={{ backgroundColor: '#f48a9c' }}
    >
      <View className="flex-1" style={{ paddingTop: insets.top + 16 }}>
        {/* ヘッダー */}
        <View className="items-center px-6 pb-6">
          <Text className="text-3xl font-black text-white" style={{ textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 }}>
            ポケモン誕生日診断
          </Text>
          <Text className="text-white text-sm mt-1 opacity-90">
            生年月日からあなたのポケモンを見つけよう！
          </Text>
        </View>

        {/* ピッカーカード */}
        <View className="flex-1 px-5 justify-center">
          <View className="bg-white rounded-3xl shadow-xl p-6">
            <Text className="text-center text-gray-400 text-xs tracking-widest mb-5">
              生 年 月 日 を 選 択
            </Text>
            <View className="flex-row items-center justify-center gap-2">
              <NumberPicker values={YEARS}  selected={year}  onChange={setYear}  label="年" width={96} />
              <Text className="text-gray-300 text-xl mb-5">·</Text>
              <NumberPicker values={MONTHS} selected={month} onChange={setMonth} label="月" width={62} />
              <Text className="text-gray-300 text-xl mb-5">·</Text>
              <NumberPicker values={DAYS}   selected={day}   onChange={setDay}   label="日" width={62} />
            </View>
            <Text className="text-center text-gray-600 font-bold text-xl mt-4">
              {year}年{month}月{day}日
            </Text>
          </View>
        </View>

        {/* スタートボタン */}
        <View className="px-5 pt-5" style={{ paddingBottom: insets.bottom + 100 }}>
          <Animated.View style={animStyle}>
            <Pressable onPress={handleStart}
              className="w-full bg-white rounded-2xl py-5 items-center shadow-lg">
              <Text className="text-red-500 font-black text-xl">スタート！</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
}
