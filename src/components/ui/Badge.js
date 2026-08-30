import React from 'react';
import { View, Text } from 'react-native';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva('self-start flex-row items-center rounded-full border px-2.5 py-1', {
  variants: {
    variant: {
      default: 'bg-panel-alt border-border',
      live: 'bg-teal/10 border-teal/30',
      simulated: 'bg-rose/10 border-rose/30',
      process: 'bg-amber/10 border-amber/30',
      outline: 'bg-transparent border-border-hi',
    },
  },
  defaultVariants: { variant: 'default' },
});

const textVariants = {
  default: 'text-mid',
  live: 'text-teal',
  simulated: 'text-rose',
  process: 'text-amber',
  outline: 'text-mid',
};

export function Badge({ variant = 'default', dot = false, className, textClassName, children }) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      {dot && (
        <View
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            variant === 'live' && 'bg-teal',
            variant === 'simulated' && 'bg-rose',
            variant === 'process' && 'bg-amber',
            variant === 'default' && 'bg-low',
            variant === 'outline' && 'bg-low'
          )}
        />
      )}
      <Text className={cn('text-[10px] font-bold tracking-wide uppercase', textVariants[variant], textClassName)}>
        {children}
      </Text>
    </View>
  );
}
