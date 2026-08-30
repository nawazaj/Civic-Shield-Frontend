import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

function Bar({ label, val, max, delay }) {
  const width = useSharedValue(0);
  const pct = (val / max) * 100;

  useEffect(() => {
    width.value = withTiming(pct, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [pct]);

  const style = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View className="flex-row items-center mb-2 gap-2">
      <Text className="w-[72px] text-low text-[11px]" numberOfLines={1}>{label}</Text>
      <View className="flex-1 h-1.5 bg-panel-alt rounded-full overflow-hidden">
        <Animated.View className="h-full bg-green rounded-full" style={style} />
      </View>
      <Text className="w-9 text-right text-hi text-[11px]" style={{ fontVariant: ['tabular-nums'] }}>{val}%</Text>
    </View>
  );
}

function Bars({ data }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <View>
      {entries.map(([label, val], i) => (
        <Bar key={label} label={label} val={val} max={max} delay={i * 40} />
      ))}
    </View>
  );
}

export default function DemographicsPanel({ demographics }) {
  if (!demographics) return null;
  const { age_distribution, geographic_distribution, language_distribution } = demographics;
  return (
    <View>
      <View className="mb-3.5">
        <Text className="text-mid text-xs font-semibold mb-2">Age Bracket</Text>
        <Bars data={age_distribution} />
      </View>
      <View className="mb-3.5">
        <Text className="text-mid text-xs font-semibold mb-2">Region</Text>
        <Bars data={geographic_distribution} />
      </View>
      <View className="mb-1">
        <Text className="text-mid text-xs font-semibold mb-2">Language</Text>
        <Bars data={language_distribution} />
      </View>
    </View>
  );
}
