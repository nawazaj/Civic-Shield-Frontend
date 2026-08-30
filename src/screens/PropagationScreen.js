import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getPropagationTimeline } from '../api/client';
import { Panel } from '../components/Panel';
import StateBlock from '../components/StateBlock';
import PropagationFeed from '../components/PropagationFeed';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/tokens';

export default function PropagationScreen({ route }) {
  const incomingTopic = route?.params?.topic;
  const [topic, setTopic] = useState(incomingTopic || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((topicValue, isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    getPropagationTimeline(topicValue || undefined, 30)
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  // Re-run whenever a new topic arrives via navigation params (tapping a
  // trend flashcard on Overview navigates here with a fresh `topic` each
  // time, even if the screen was already mounted).
  useEffect(() => {
    setTopic(incomingTopic || '');
    load(incomingTopic || '');
  }, [incomingTopic, load]);

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load(topic, true)} tintColor={colors.signalGreen} colors={[colors.signalGreen]} />
      }
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <Text className="text-low text-[10.5px] font-semibold tracking-widest uppercase">NETWORK / PROPAGATION</Text>
        <Text className="text-hi text-3xl font-extrabold tracking-tight mt-1">Discussion Cascade</Text>
        <Text className="text-low text-[13px] mt-1 mb-4">Chronological trace of posts, oldest first.</Text>
      </Animated.View>

      <View className="flex-row gap-2 mb-4">
        <Input
          placeholder="Filter by keyword (e.g. AI, policy)…"
          value={topic}
          onChangeText={setTopic}
          onSubmitEditing={() => load(topic)}
          className="flex-1"
        />
        <Button onPress={() => load(topic)} loading={loading}>
          Filter
        </Button>
      </View>

      {loading && !result && <StateBlock kind="loading" message="Walking the cascade." />}
      {error && <StateBlock kind="error" message={error} />}

      {result && (
        <Panel eyebrow={`${result.total_cascade_steps} STEPS · ${result.filtered_topic?.toUpperCase()}`} delay={80}>
          {result.cascade_flow.length
            ? <PropagationFeed events={result.cascade_flow} />
            : <StateBlock kind="empty" message="No posts match this filter yet." />}
        </Panel>
      )}
    </ScrollView>
  );
}
