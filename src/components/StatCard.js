import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function StatCard({ label, value, unit, accent = '#5b8def', delay = 0 }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(420).springify().damping(18)}
      className="flex-1 mx-1 rounded-xl2 border border-border bg-panel overflow-hidden"
    >
      {/* thin gradient accent strip along the top edge — a small "professional dashboard" tell */}
      <LinearGradient colors={[accent, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 2.5 }} />
      <View className="p-3.5">
        <Text className="text-low text-[10.5px] font-semibold tracking-widest uppercase mb-2">{label}</Text>
        <Text className="text-hi text-[26px] font-bold" style={{ fontVariant: ['tabular-nums'] }}>
          {value}
          {unit ? <Text className="text-mid text-sm"> {unit}</Text> : null}
        </Text>
      </View>
    </Animated.View>
  );
}
