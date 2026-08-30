import React, { useState } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ingestMock, ingestReddit, ingestTelegram, ingestX, ingestBatchLive, runPipeline,
} from '../api/client';
import { Panel } from '../components/Panel';
import IngestActionCard from '../components/IngestActionCard';

export default function IngestScreen() {
  const [log, setLog] = useState([]);

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
          Trigger the backend's own ingestion endpoints directly. Nothing runs on a schedule —
          data only enters the system when one of these is called.
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

      <IngestActionCard
        title="Run Analytics Pipeline"
        tag="PROCESS"
        onRun={wrap('run-pipeline', () => runPipeline())}
        note="Runs sentiment analysis + network-edge extraction on up to 50 unprocessed posts. Call repeatedly if you've ingested more than 50."
        delay={200}
      />

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
