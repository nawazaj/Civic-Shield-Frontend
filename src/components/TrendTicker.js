import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../lib/utils';

function badgeClasses(status) {
  if (status === 'surging') return 'text-amber border-amber/50';
  if (status === 'rising') return 'text-green border-green/50';
  return 'text-low border-border-hi';
}

export default function TrendTicker({ trends }) {
  if (!trends?.length) return null;
  return (
    <View>
      {trends.map((t, i) => (
        <View
          key={i}
          className={cn(
            'flex-row justify-between items-center py-2.5',
            i < trends.length - 1 && 'border-b border-border'
          )}
        >
          <Text className="text-hi text-[13px] flex-1 mr-2" numberOfLines={1}>{t.topic}</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-low text-[11px]">{t.frequency} mentions</Text>
            <Text className={cn('text-[11px] font-bold border rounded-md px-1.5 py-0.5', badgeClasses(t.status))}>
              {t.velocity_percentage > 0 ? '+' : ''}{t.velocity_percentage}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
