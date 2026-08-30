import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Radio, Activity, ShieldAlert, MinusCircle } from 'lucide-react-native';
import { colors } from '../theme/tokens';
import { PulseDot } from './ui/PulseDot';

const SENTIMENT_META = {
  positive: {
    color: colors.signalGreen,
    tint: colors.signalGreenDim,
    Icon: Activity,
    headline: 'POSITIVE',
    line: 'The audience mood is leaning positive right now.',
  },
  negative: {
    color: colors.signalRose,
    tint: '#3a0f16',
    Icon: ShieldAlert,
    headline: 'NEGATIVE',
    line: 'Negative sentiment is currently dominant — worth a closer look.',
  },
  neutral: {
    color: colors.signalSilver,
    tint: '#1c2126',
    Icon: MinusCircle,
    headline: 'NEUTRAL',
    line: 'Sentiment is largely neutral across ingested platforms.',
  },
};

export default function HeroBanner({ distribution, totalPosts }) {
  const entries = Object.entries(distribution || {});
  if (!entries.length) return null;

  const [dominant, pct] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const meta = SENTIMENT_META[dominant] || SENTIMENT_META.neutral;
  const Icon = meta.Icon;

  return (
    <Animated.View entering={FadeIn.duration(500)} className="mb-4 rounded-xl2 overflow-hidden border border-border">
      <LinearGradient
        colors={[meta.tint, colors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20, minHeight: 150, justifyContent: 'space-between' }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <PulseDot color={meta.color} size={7} />
            <Text className="text-[10px] font-bold tracking-widest" style={{ color: meta.color }}>
              LIVE SIGNAL
            </Text>
          </View>
          <Icon size={18} color={meta.color} strokeWidth={2} />
        </View>

        <View>
          <Text className="text-hi text-[34px] font-extrabold tracking-tight" style={{ fontVariant: ['tabular-nums'] }}>
            {pct}%
          </Text>
          <Text className="text-[15px] font-bold tracking-wide mt-0.5" style={{ color: meta.color }}>
            {meta.headline} SENTIMENT
          </Text>
          <Text className="text-mid text-[12.5px] mt-2 leading-[17px]" style={{ maxWidth: '90%' }}>
            {meta.line}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 mt-3">
          <Radio size={11} color={colors.textLow} />
          <Text className="text-low text-[10.5px] font-mono">{totalPosts} POSTS ANALYZED</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
