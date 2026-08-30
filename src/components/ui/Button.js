import React from 'react';
import { Pressable, Text, ActivityIndicator, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cva } from 'class-variance-authority';
import * as Haptics from 'expo-haptics';
import { cn } from '../../lib/utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const buttonVariants = cva('flex-row items-center justify-center rounded-lg px-4 py-2.5', {
  variants: {
    variant: {
      default: 'bg-green',
      outline: 'bg-transparent border border-border-hi',
      ghost: 'bg-transparent',
      destructive: 'bg-rose',
    },
    size: {
      default: '',
      sm: 'px-3 py-2',
      lg: 'px-5 py-3.5',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

const labelVariants = {
  default: 'text-[#061021] font-bold',
  outline: 'text-hi font-semibold',
  ghost: 'text-mid font-semibold',
  destructive: 'text-white font-bold',
};

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  className,
  textClassName,
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 80 });
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
      style={style}
      className={cn(buttonVariants({ variant, size }), (disabled || loading) && 'opacity-50', className)}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'default' ? '#061021' : '#a9b6d4'} />
      ) : typeof children === 'string' ? (
        <Text className={cn('text-[13px]', labelVariants[variant], textClassName)}>{children}</Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}
