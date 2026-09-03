import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ingestMock, ingestReddit, ingestTelegram, ingestX, ingestBatchLive,
  getProcessingStatus,
} from '../api/client';
import { Panel } from '../components/Panel';
import IngestActionCard from '../components/IngestActionCard';

export default function IngestScreen() {
  const [log, setLog] = useState([]);
  const [processing, setProcessing] = useState(null);

  const refreshProcessing = () => {
    getProcessingStatus().then(setProcessing).catch(() => {});
  };

  useEffect(() => {
    refreshProcessing();
    const interval = setInterval(refreshProcessing, 5000);
    return () => clearInterval(interval);
  }, []);

  const pushLog = (label, ok, detail) => {
    setLog((l) => [{ ts: new Date().toLocaleTimeString(), label, ok, detail }, ...l].slice(0, 40));
  };

  const wrap = (label, fn) => async (values) => {
    try {
      const res = await fn(values);
      pushLog(label, true, JSON.stringify(res));
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      pushLog(label, false, err.message);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <Text className="text-low text-[10.5px] font-semibold tracking-widest uppercase">DATA SOURCES</Text>
        <Text className="text-hi text-3xl font-extrabold tracking-tight mt-1">Ingestion Controls</Text>
        <Text className="text-low text-[13px] mt-1 mb-4 leading-[18px]">
          Pull public signals from a source. New posts are analyzed automatically after each call.
        </Text>
      </Animated.View>

      <IngestActionCard
        title="Mock Generator"
        tag="SIMULATED"
        fields={[{ name: 'count', placeholder: 'count', defaultValue: '30' }]}
        onRun={wrap('mock', ({ count }) => ingestMock(Number(count) || 30))}
        note="Generates random posts for testing. Not real data."
        delay={0}
      />

      <IngestActionCard
        title="Reddit"
        tag="LIVE"
        fields={[
          { name: 'subreddit', placeholder: 'subreddit', defaultValue: 'technology' },
          { name: 'limit', placeholder: 'limit', defaultValue: '15' },
        ]}
        onRun={wrap('reddit', ({ subreddit, limit }) => ingestReddit(subreddit, Number(limit) || 15))}
        note="Pulls real posts from a subreddit's public RSS feed. Genuine public data."
        delay={40}
      />

      <IngestActionCard
        title="Telegram"
        tag="LIVE"
        fields={[
          { name: 'channel', placeholder: 'channel', defaultValue: 'durov' },
          { name: 'limit', placeholder: 'limit', defaultValue: '15' },
        ]}
        onRun={wrap('telegram', ({ channel, limit }) => ingestTelegram(channel, Number(limit) || 15))}
        note="Scrapes a public Telegram channel's preview page. Genuine public data, but fragile if Telegram changes its markup."
        delay={80}
      />

      <IngestActionCard
        title="X / Twitter"
        tag="SIMULATED"
        fields={[
          { name: 'query', placeholder: 'query', defaultValue: 'technology' },
          { name: 'limit', placeholder: 'limit', defaultValue: '15' },
        ]}
        onRun={wrap('x', ({ query, limit }) => ingestX(query, Number(limit) || 15))}
        note="Despite the name, this does not call the real X API — it generates posts from a small fixed template list."
        delay={120}
      />

      <IngestActionCard
        title="Batch Live"
        tag="LIVE"
        onRun={wrap('batch-live', () => ingestBatchLive())}
        note="Pulls from 3 subreddits and 3 Telegram channels in one call."
        delay={160}
      />

      <Panel eyebrow="ANALYTICS STATUS" title="Processing" delay={200}>
        {processing ? (
          <View className="gap-1">
            <Text className="text-mid text-[12.5px]">
              <Text className="text-hi font-bold">{processing.processed_posts}</Text>
              {' / '}{processing.total_posts} posts analyzed ·{' '}
              <Text className={processing.pending_posts ? 'text-amber font-bold' : 'text-teal font-bold'}>
                {processing.pending_posts ? `${processing.pending_posts} pending` : 'up to date'}
              </Text>
            </Text>
            <Text className="text-low text-[11.5px]">
              {processing.ai_provider === 'groq' ? `AI: ${processing.ai_model}` : 'AI fallback mode'}
              {processing.last_processed_at ? ` · Updated ${new Date(processing.last_processed_at).toLocaleString()}` : ''}
            </Text>
          </View>
        ) : (
          <Text className="text-low text-[12.5px]">Checking processing status...</Text>
        )}
      </Panel>

      <Panel eyebrow="ACTIVITY LOG" title="Recent Calls" delay={240}>
        {log.length === 0 && <Text className="text-low text-[12.5px]">No actions run yet.</Text>}
        {log.map((l, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.duration(250)}
            className="py-1.5 border-b border-border"
          >
            <Text className="text-mid text-[11.5px]">
              <Text className="text-low">{l.ts}  </Text>
              <Text className={l.ok ? 'text-teal font-bold' : 'text-rose font-bold'}>{l.ok ? 'OK' : 'ERR'}</Text>
              {'  '}{l.label} — {l.detail}
            </Text>
          </Animated.View>
        ))}
      </Panel>
    </ScrollView>
  );
}
