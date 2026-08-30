import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getDashboardOverview } from '../api/client';
import { Panel } from '../components/Panel';
import StateBlock from '../components/StateBlock';
import SkeletonOverview from '../components/SkeletonOverview';
import HeroBanner from '../components/HeroBanner';
import StatCard from '../components/StatCard';
import SentimentDonut from '../components/SentimentDonut';
import TrendStories from '../components/TrendStories';
import TrendTicker from '../components/TrendTicker';
import DemographicsPanel from '../components/DemographicsPanel';
import NetworkGraph from '../components/NetworkGraph';
import InfluencerList from '../components/InfluencerList';
import SummaryPulse from '../components/SummaryPulse';
import { Button } from '../components/ui/Button';
import { PulseDot } from '../components/ui/PulseDot';
import { colors } from '../theme/tokens';

const AUTO_REFRESH_INTERVAL_MS = 15000;

export default function OverviewScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [live, setLive] = useState(false);
  const intervalRef = useRef(null);

  const load = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    getDashboardOverview()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  // "LIVE" mode: silently re-poll the dashboard on an interval, matching the
  // monitoring-console feel the rest of the UI is going for. Errors during a
  // background poll don't clear existing data or show the big error state —
  // only a failed *manual* refresh does that.
  useEffect(() => {
    if (!live) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      getDashboardOverview().then(setData).catch(() => {});
    }, AUTO_REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [live]);

  const toggleLive = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLive((v) => !v);
  };

  const goToTopic = (topic) => navigation?.navigate('Propagation', { topic });

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => load(true)}
          tintColor={colors.signalGreen}
          colors={[colors.signalGreen]}
        />
      }
    >
      <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-end justify-between mb-4">
        <View className="flex-1">
          <Text className="text-low text-[10.5px] font-semibold tracking-widest uppercase">DASHBOARD / OVERVIEW</Text>
          <Text className="text-hi text-3xl font-extrabold tracking-tight mt-1">Signal Board</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={toggleLive}
            className="flex-row items-center gap-1.5 rounded-full border px-3 py-2"
            style={{
              borderColor: live ? colors.signalGreen + '55' : colors.border,
              backgroundColor: live ? colors.signalGreen + '15' : 'transparent',
            }}
          >
            <PulseDot color={live ? colors.signalGreen : colors.textLow} size={6} active={live} />
            <Text className="text-[10.5px] font-bold tracking-wide" style={{ color: live ? colors.signalGreen : colors.textLow }}>
              LIVE
            </Text>
          </Pressable>
          <Button variant="outline" size="sm" onPress={() => load()} loading={loading}>
            Refresh
          </Button>
        </View>
      </Animated.View>

      {loading && !data && <SkeletonOverview />}
      {error && (
        <StateBlock
          kind="error"
          message={`Could not reach the backend (${error}). Check src/config.js and that the FastAPI server is running.`}
        />
      )}

      {data && (
        <>
          <HeroBanner distribution={data.sentiment_distribution} totalPosts={data.summary_metrics.total_posts_ingested} />

          <View className="flex-row mb-4 -mx-1">
            <StatCard label="POSTS INGESTED" value={data.summary_metrics.total_posts_ingested} accent={colors.signalGreen} delay={0} />
            <StatCard label="NODES MAPPED" value={data.summary_metrics.total_nodes_mapped} accent={colors.signalAmber} delay={60} />
            <StatCard label="EDGES CONNECTED" value={data.summary_metrics.total_edges_connected} accent={colors.signalPurple} delay={120} />
          </View>

          {data.trending_topics?.length ? (
            <View className="mb-4">
              <Text className="text-low text-[10.5px] font-semibold tracking-widest uppercase mb-2 px-1">
                TOP MOVING TOPICS
              </Text>
              <TrendStories trends={data.trending_topics} onSelectTopic={goToTopic} />
            </View>
          ) : null}

          <Panel eyebrow="SENTIMENT DISTRIBUTION" title="Overall Mood" delay={80}>
            <SentimentDonut distribution={data.sentiment_distribution} />
          </Panel>

          <Panel eyebrow="TREND VELOCITY" title="All Topics" delay={120}>
            {data.trending_topics?.length
              ? <TrendTicker trends={data.trending_topics} />
              : <StateBlock kind="empty" message="No hashtag activity in the current time window." />}
          </Panel>

          <Panel eyebrow="AUDIENCE PROFILE" title="Demographics Breakdown" delay={160}>
            <DemographicsPanel demographics={data.demographics_breakdown} />
          </Panel>

          <Panel eyebrow="NETWORK TOPOLOGY" title="Top Influencers" delay={200}>
            {data.network_topology?.top_influencers?.length
              ? <InfluencerList influencers={data.network_topology.top_influencers} />
              : <StateBlock kind="empty" message="No network edges yet — run the analytics pipeline first." />}
          </Panel>

          <Panel eyebrow="NETWORK TOPOLOGY" title="Interaction Graph" delay={240}>
            {data.network_topology?.nodes?.length
              ? <NetworkGraph nodes={data.network_topology.nodes} edges={data.network_topology.edges} />
              : <StateBlock kind="empty" message="No accounts to graph yet. Ingest data and run the pipeline." />}
          </Panel>

          <SummaryPulse text={data.ai_executive_summary} />
        </>
      )}
    </ScrollView>
  );
}
