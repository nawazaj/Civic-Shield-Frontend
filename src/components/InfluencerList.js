import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../lib/utils';

const MEDALS = ['#ffd166', '#c9ccd6', '#d99a5b'];

export default function InfluencerList({ influencers }) {
  if (!influencers?.length) return null;
  return (
    <View>
      {influencers.map((inf, i) => (
        <View
          key={inf.id}
          className={cn(
            'flex-row items-center justify-between py-2.5',
            i < influencers.length - 1 && 'border-b border-border'
          )}
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View
              className="w-5 h-5 rounded-full items-center justify-center mr-2.5"
              style={{ backgroundColor: (MEDALS[i] || '#22304f') + '26' }}
            >
              <Text className="text-[9.5px] font-bold" style={{ color: MEDALS[i] || '#6b7796' }}>
                {i + 1}
              </Text>
            </View>
            <Text className="text-mid text-[12.5px] flex-1" numberOfLines={1}>{inf.id}</Text>
          </View>
          <Text className="text-hi text-[12.5px] font-semibold" style={{ fontVariant: ['tabular-nums'] }}>
            {inf.influence_score}
          </Text>
        </View>
      ))}
    </View>
  );
}
