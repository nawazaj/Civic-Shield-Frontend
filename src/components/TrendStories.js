import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, Pressable, Platform } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/tokens';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32; // matches the screen's horizontal padding
const CARD_HEIGHT = 168;

const STATUS_META = {
  surging: { color: colors.signalAmber, glow: 'rgba(255,176,32,0.35)', Icon: Flame, label: 'SURGING' },
  rising: { color: colors.signalGreen, glow: 'rgba(51,227,122,0.35)', Icon: TrendingUp, label: 'RISING' },
  declining: { color: colors.textLow, glow: 'rgba(118,118,118,0.2)', Icon: TrendingDown, label: 'DECLINING' },
};

function StoryCard({ trend, rank, onPress }) {
  const meta = STATUS_META[trend.status] || STATUS_META.declining;
  const Icon = meta.Icon;

  return (
    <View style={{ width: CARD_WIDTH, paddingHorizontal: 4 }}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress?.(trend);
        }}
        style={{
          width: '100%',
          height: CARD_HEIGHT,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: meta.color + '55',
          shadowColor: meta.color,
          shadowOpacity: 0.5,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <LinearGradient
          colors={[colors.bgPanelAlt, colors.bg]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, padding: 18, justifyContent: 'space-between' }}
        >
          {/* Giant outlined rank numeral — the signature Netflix "Top 10" tell */}
          <Svg
            width={170}
            height={170}
            style={{ position: 'absolute', right: -16, bottom: -34 }}
          >
            <SvgText
              x={170}
              y={150}
              textAnchor="end"
              fontSize={150}
              fontWeight="900"
              fill="none"
              stroke={meta.color}
              strokeOpacity={0.28}
              strokeWidth={1.5}
            >
              {rank}
            </SvgText>
          </Svg>

          <View className="flex-row items-center justify-between">
            <View
              className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1 self-start"
              style={{ backgroundColor: meta.glow }}
            >
              <Icon size={12} color={meta.color} />
              <Text className="text-[10px] font-bold tracking-wide" style={{ color: meta.color }}>
                {meta.label}
              </Text>
            </View>
            <Text className="text-low text-[11px] font-mono">#{rank} TRENDING</Text>
          </View>

          <View>
            <Text className="text-hi text-2xl font-extrabold tracking-tight" numberOfLines={1}>
              {trend.topic}
            </Text>
            <View className="flex-row items-center gap-3 mt-2">
              <Text className="text-mid text-[12.5px]">{trend.frequency} mentions</Text>
              <Text className="text-[13px] font-bold" style={{ color: meta.color }}>
                {trend.velocity_percentage > 0 ? '+' : ''}{trend.velocity_percentage}% velocity
              </Text>
            </View>
            <Text className="text-low text-[10px] mt-2 tracking-wide">TAP TO VIEW CASCADE →</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

export default function TrendStories({ trends, onSelectTopic }) {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  if (!trends?.length) return null;

  return (
    <View>
      <FlatList
        ref={listRef}
        data={trends}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        keyExtractor={(t, i) => `${t.topic}-${i}`}
        renderItem={({ item, index: i }) => (
          <StoryCard trend={item} rank={i + 1} onPress={(t) => onSelectTopic?.(t.topic)} />
        )}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setIndex(i);
        }}
      />
      <View className="flex-row justify-center gap-1.5 mt-3">
        {trends.map((_, i) => (
          <View
            key={i}
            className="h-1.5 rounded-full"
            style={{
              width: i === index ? 16 : 6,
              backgroundColor: i === index ? colors.signalGreen : colors.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}
