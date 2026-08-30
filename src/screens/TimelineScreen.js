import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getTimeline } from '../api/client';
import { Panel } from '../components/Panel';
import StateBlock from '../components/StateBlock';
import TimelineChart from '../components/TimelineChart';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/tokens';

export default function TimelineScreen() {
  const [timeline, setTimeline] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    getTimeline()
      .then((res) => setTimeline(res.timeline))
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.signalGreen} colors={[colors.signalGreen]} />
      }
    >
      <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-end justify-between mb-4">
        <View className="flex-1">
          <Text className="text-low text-[10.5px] font-semibold tracking-widest uppercase">DASHBOARD / TIMELINE</Text>
          <Text className="text-hi text-3xl font-extrabold tracking-tight mt-1">Hourly Volume & Sentiment</Text>
        </View>
        <Button variant="outline" size="sm" onPress={() => load()} loading={loading}>
          Refresh
        </Button>
      </Animated.View>

      {loading && !timeline && <StateBlock kind="loading" message="Aggregating hourly buckets." />}
      {error && <StateBlock kind="error" message={error} />}
      {timeline && timeline.length === 0 && (
        <StateBlock kind="empty" message="No processed posts yet — ingest data and run the analytics pipeline." />
      )}

      {timeline?.length > 0 && (
        <Panel delay={80}>
          <TimelineChart timeline={timeline} />
        </Panel>
      )}
    </ScrollView>
  );
}
