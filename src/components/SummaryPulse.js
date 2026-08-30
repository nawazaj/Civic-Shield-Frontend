import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as ExpoGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/tokens';

function Waveform() {
  const unit = 'l60,0 l12,0 l8,-30 l12,60 l12,-30 l56,0';
  const path = `M0,40 ${unit} m0,0 ${unit} m0,0 ${unit} m0,0 ${unit} m0,0 ${unit}`;
  return (
    <Svg width="100%" height={60} viewBox="0 0 800 80" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={colors.signalTeal} stopOpacity={0} />
          <Stop offset="45%" stopColor={colors.signalTeal} stopOpacity={0.9} />
          <Stop offset="55%" stopColor={colors.signalAmber} stopOpacity={0.9} />
          <Stop offset="100%" stopColor={colors.signalAmber} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={path} fill="none" stroke="url(#pulseGrad)" strokeWidth={1.6} />
    </Svg>
  );
}

export default function SummaryPulse({ text }) {
  if (!text) return null;
  return (
    <Animated.View entering={FadeInDown.duration(450).springify().damping(18)} className="rounded-xl2 border border-border-hi mb-10 overflow-hidden">
      <ExpoGradient colors={['#151f38', '#0f1729']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View className="p-4">
          <Text className="text-low text-[10.5px] font-semibold tracking-widest uppercase">AI EXECUTIVE SUMMARY</Text>
          <Text className="text-hi text-base font-bold mt-1 mb-2">Signal Interpretation</Text>
          <Waveform />
          <Text className="text-mid text-[13.5px] leading-5 mt-2">{text}</Text>
        </View>
      </ExpoGradient>
    </Animated.View>
  );
}
