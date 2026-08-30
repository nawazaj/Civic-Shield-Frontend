import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, CardHeader, CardEyebrow, CardTitle, CardContent } from './ui/Card';
import { cn } from '../lib/utils';

export function Panel({ eyebrow, title, children, className, delay = 0 }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(420).springify().damping(18)}>
      <Card className={cn('mb-4', className)}>
        {(eyebrow || title) && (
          <CardHeader className="pb-3">
            {eyebrow ? <CardEyebrow>{eyebrow}</CardEyebrow> : null}
            {title ? <CardTitle>{title}</CardTitle> : null}
          </CardHeader>
        )}
        <CardContent className={cn(!(eyebrow || title) && 'pt-4')}>{children}</CardContent>
      </Card>
    </Animated.View>
  );
}

export const Eyebrow = ({ children, className }) => (
  <Text className={cn('text-low text-[10.5px] font-semibold tracking-widest uppercase mb-1', className)}>
    {children}
  </Text>
);
