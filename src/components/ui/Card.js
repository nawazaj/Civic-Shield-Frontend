import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <View
      className={cn(
        'rounded-xl2 border border-border bg-panel',
        // subtle elevation so cards read as "lifted" panels, not flat boxes
        'shadow-lg shadow-black/40',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <View className={cn('px-4 pt-4 pb-2', className)} {...props}>
      {children}
    </View>
  );
}

export function CardEyebrow({ className, children, ...props }) {
  return (
    <Text
      className={cn('text-[10.5px] font-semibold tracking-widest text-low uppercase mb-1', className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <Text className={cn('text-hi text-base font-bold', className)} {...props}>
      {children}
    </Text>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <View className={cn('px-4 pb-4', className)} {...props}>
      {children}
    </View>
  );
}
