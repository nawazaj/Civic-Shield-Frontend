import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

function Block({ style }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 700 }),
        withTiming(0.35, { duration: 700 })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ backgroundColor: '#1c1c1c', borderRadius: 8 }, style, animStyle]}
    />
  );
}

export default function SkeletonOverview() {
  return (
    <View>
      <Block style={{ height: 150, marginBottom: 16 }} />
      <View className="flex-row mb-4 -mx-1">
        <Block style={{ flex: 1, height: 78, marginHorizontal: 4 }} />
        <Block style={{ flex: 1, height: 78, marginHorizontal: 4 }} />
        <Block style={{ flex: 1, height: 78, marginHorizontal: 4 }} />
      </View>
      <Block style={{ height: 180, marginBottom: 16 }} />
      <Block style={{ height: 220, marginBottom: 16 }} />
      <Block style={{ height: 180, marginBottom: 16 }} />
    </View>
  );
}
