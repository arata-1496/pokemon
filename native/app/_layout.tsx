import '../global.css';
import { Tabs } from 'expo-router';
import { Sparkles, Search, BookOpen, Table2 } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type IconProps = { color: string; focused: boolean };

function TabIcon({ Icon, focused }: { Icon: any; focused: boolean }) {
  return (
    <View className={`p-1.5 rounded-2xl ${focused ? 'bg-red-500' : ''}`}>
      <Icon size={22} stroke={focused ? '#fff' : '#9CA3AF'} strokeWidth={focused ? 2.5 : 1.9} color={focused ? '#fff' : '#9CA3AF'} />
    </View>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.75)',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: 'rgba(255,255,255,0.7)',
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
          tabBarActiveBackgroundColor: 'transparent',
          tabBarItemStyle: { borderRadius: 24, marginHorizontal: 2 },
        }}
      >
        <Tabs.Screen name="index"   options={{ title: '診断',   tabBarIcon: ({ focused }) => <TabIcon Icon={Sparkles} focused={focused} /> }} />
        <Tabs.Screen name="search"  options={{ title: '検索',   tabBarIcon: ({ focused }) => <TabIcon Icon={Search}   focused={focused} /> }} />
        <Tabs.Screen name="pokedex" options={{ title: '図鑑',   tabBarIcon: ({ focused }) => <TabIcon Icon={BookOpen} focused={focused} /> }} />
        <Tabs.Screen name="types"   options={{ title: 'タイプ表', tabBarIcon: ({ focused }) => <TabIcon Icon={Table2}  focused={focused} /> }} />
        <Tabs.Screen name="result"   options={{ href: null }} />
        <Tabs.Screen name="pokemon/[id]" options={{ href: null }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
