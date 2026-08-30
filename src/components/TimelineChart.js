import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { scaleLinear, scalePoint } from 'd3-scale';
import { area, stack, curveMonotoneX } from 'd3-shape';
import { colors } from '../theme/tokens';

const HEIGHT = 260;
const PAD = { top: 10, right: 10, bottom: 24, left: 10 };

function formatHour(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' });
}

const SERIES = [
  { key: 'positive', color: colors.positive },
  { key: 'neutral', color: colors.neutral },
  { key: 'negative', color: colors.negative },
];

export default function TimelineChart({ timeline }) {
  if (!timeline?.length) return null;

  const width = Dimensions.get('window').width - 64; // account for screen + panel padding
  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const labels = timeline.map((row) => formatHour(row.timestamp));
  const x = scalePoint().domain(labels).range([0, innerW]);

  const stackGen = stack().keys(SERIES.map((s) => s.key));
  const stacked = stackGen(timeline);
  const maxY = Math.max(1, ...stacked.flat().map((d) => d[1]));
  const y = scaleLinear().domain([0, maxY]).range([innerH, 0]);

  const areaGen = area()
    .x((d, i) => x(labels[i]))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(curveMonotoneX);

  // Show every Nth label to avoid crowding
  const tickEvery = Math.max(1, Math.ceil(labels.length / 6));

  return (
    <View>
      <Svg width={width} height={HEIGHT}>
        <Defs>
          {SERIES.map((s) => (
            <LinearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={s.color} stopOpacity={0.5} />
              <Stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
            </LinearGradient>
          ))}
        </Defs>

        {/* horizontal gridlines */}
        {[0, 0.5, 1].map((f, i) => (
          <Line
            key={i}
            x1={PAD.left}
            x2={width - PAD.right}
            y1={PAD.top + innerH * f}
            y2={PAD.top + innerH * f}
            stroke={colors.border}
            strokeWidth={1}
          />
        ))}

        {stacked.map((layer, i) => (
          <Path
            key={SERIES[i].key}
            d={areaGen(layer)}
            fill={`url(#grad-${SERIES[i].key})`}
            stroke={SERIES[i].color}
            strokeWidth={1.5}
            transform={`translate(${PAD.left}, ${PAD.top})`}
          />
        ))}
      </Svg>

      {/* x-axis labels */}
      <View style={styles.xAxis}>
        {labels
          .filter((_, i) => i % tickEvery === 0)
          .map((l, i) => (
            <Text key={i} style={styles.xLabel}>{l}</Text>
          ))}
      </View>

      {/* legend */}
      <View style={styles.legend}>
        {SERIES.map((s) => (
          <View key={s.key} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel}>{s.key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: -18 },
  xLabel: { color: colors.textLow, fontSize: 9.5 },
  legend: { flexDirection: 'row', gap: 16, marginTop: 8, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: colors.textMid, fontSize: 11.5, textTransform: 'capitalize' },
});
