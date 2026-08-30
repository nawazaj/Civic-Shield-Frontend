import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { pie, arc } from 'd3-shape';
import { colors } from '../theme/tokens';

const COLORS = {
  positive: colors.positive,
  negative: colors.negative,
  neutral: colors.neutral,
};

const SIZE = 140;
const RADIUS = SIZE / 2;

export default function SentimentDonut({ distribution }) {
  const entries = Object.entries(distribution || {});
  const data = entries.map(([name, value]) => ({ name, value }));
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length) return null;

  const pieGen = pie().value((d) => d.value).sort(null);
  const arcs = pieGen(data);
  const arcGen = arc().innerRadius(RADIUS * 0.68).outerRadius(RADIUS * 0.98).cornerRadius(3);

  return (
    <View className="flex-row items-center gap-4">
      <View>
        <Svg width={SIZE} height={SIZE}>
          <G x={RADIUS} y={RADIUS}>
            {arcs.map((a, i) => (
              <Path key={i} d={arcGen(a)} fill={COLORS[data[i].name] || colors.textLow} />
            ))}
          </G>
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-hi text-lg font-bold">{total}%</Text>
          <Text className="text-low text-[9px] tracking-wide">TOTAL</Text>
        </View>
      </View>

      <View className="flex-1">
        {data.map((d, i) => (
          <View key={i} className="flex-row items-center mb-2 gap-2">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[d.name] || colors.textLow }} />
            <Text className="flex-1 text-mid text-[12.5px] capitalize">{d.name}</Text>
            <Text className="text-hi text-[12.5px]" style={{ fontVariant: ['tabular-nums'] }}>{d.value}%</Text>
          </View>
        ))}
        {total ? <Text className="text-low text-[10px] tracking-wide mt-1.5">NORMALIZED %</Text> : null}
      </View>
    </View>
  );
}
