import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { colors } from '../theme/tokens';

function sentColor(sentiment) {
  if (sentiment === 'positive') return colors.positive;
  if (sentiment === 'negative') return colors.negative;
  return colors.neutral;
}

function Row({ e, index, isLast }) {
  return (
    <Animated.View entering={FadeInLeft.delay(Math.min(index, 8) * 40).duration(320)} className="flex-row mb-1">
      <View className="w-5 items-center">
        <View className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: sentColor(e.sentiment) }} />
        {!isLast && <View className="flex-1 w-px bg-border mt-0.5" />}
      </View>
      <View className="flex-1 pb-3.5">
        <View className="flex-row flex-wrap mb-1">
          <Text className="text-green text-[11px] font-bold uppercase">{e.platform}</Text>
          <Text className="text-low text-[11px]">
            {' '}· {e.author_id} · {new Date(e.timestamp).toLocaleString()} · {e.sentiment}/{e.emotion}
          </Text>
        </View>
        <Text className="text-mid text-[13px] leading-[18px]">{e.snippet}</Text>
      </View>
    </Animated.View>
  );
}

// FlashList for the propagation cascade — this list can grow into the
// hundreds of posts, and FlashList recycles rows instead of mounting them
// all, which keeps scrolling smooth as the feed grows.
export default function PropagationFeed({ events }) {
  if (!events?.length) return null;
  // Sized to fit the whole (capped, ≤50-item) cascade so it scrolls with the
  // outer screen instead of fighting it for nested-scroll ownership.
  return (
    <View style={{ height: events.length * 84 }}>
      <FlashList
        data={events}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => <Row e={item} index={index} isLast={index === events.length - 1} />}
      />
    </View>
  );
}
