import 'react-native-gesture-handler';
import './global.css';

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LayoutDashboard, Activity, Share2, Database, ShieldCheck } from 'lucide-react-native';

import OverviewScreen from './src/screens/OverviewScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import PropagationScreen from './src/screens/PropagationScreen';
import IngestScreen from './src/screens/IngestScreen';
import { getHealth } from './src/api/client';
import { colors } from './src/theme/tokens';
import { PulseDot } from './src/components/ui/PulseDot';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgPanel,
    border: colors.border,
    primary: colors.signalGreen,
    text: colors.textHi,
  },
};

const TAB_ICONS = {
  Overview: LayoutDashboard,
  Timeline: Activity,
  Propagation: Share2,
  'Data Sources': Database,
};

function StatusBadge() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then(() => !cancelled && setOnline(true))
      .catch(() => !cancelled && setOnline(false));
    return () => { cancelled = true; };
  }, []);

  const color = online === null ? colors.signalAmber : online ? colors.positive : colors.negative;
  const label = online === null ? 'CHECKING API' : online ? 'API CONNECTED' : 'API UNREACHABLE';

  return (
    <View className="flex-row items-center gap-1.5">
      <PulseDot color={color} active={online !== false} />
      <Text className="text-[10px] font-bold tracking-wide" style={{ color }}>{label}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
          <LinearGradient
            colors={[colors.bgPanel, colors.bg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className="flex-row justify-between items-center px-4 py-3">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-7 h-7 rounded-lg bg-green/15 items-center justify-center"
                  style={{ shadowColor: colors.signalGreen, shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }}
                >
                  <ShieldCheck size={16} color={colors.signalGreen} />
                </View>
                <Text className="text-hi font-extrabold text-[16px] tracking-tight">CIVIC SHIELD</Text>
              </View>
              <StatusBadge />
            </View>
          </LinearGradient>
        </SafeAreaView>

        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bgPanel,
              borderTopColor: colors.border,
              height: 60,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarActiveTintColor: colors.signalGreen,
            tabBarInactiveTintColor: colors.textLow,
            tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600' },
            tabBarIcon: ({ color, size }) => {
              const Icon = TAB_ICONS[route.name];
              return Icon ? <Icon size={size - 4} color={color} /> : null;
            },
          })}
        >
          <Tab.Screen name="Overview" component={OverviewScreen} />
          <Tab.Screen name="Timeline" component={TimelineScreen} />
          <Tab.Screen name="Propagation" component={PropagationScreen} />
          <Tab.Screen name="Data Sources" component={IngestScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
