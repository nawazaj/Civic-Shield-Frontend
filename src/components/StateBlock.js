import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { cn } from '../lib/utils';

const TITLES = {
  loading: 'READING SIGNAL...',
  empty: 'NO DATA YET',
  error: 'CONNECTION ISSUE',
};

export default function StateBlock({ kind = 'loading', message }) {
  const isError = kind === 'error';
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className={cn(
        'rounded-xl2 border bg-panel p-4 my-2',
        isError ? 'border-rose/50' : 'border-border'
      )}
    >
      <Text className={cn('text-[11px] font-semibold tracking-widest mb-1.5', isError ? 'text-rose' : 'text-mid')}>
        {TITLES[kind] || TITLES.loading}
      </Text>
      <Text className="text-low text-[13px] leading-[18px]">{message}</Text>
    </Animated.View>
  );
}
