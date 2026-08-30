import React, { useEffect, useRef, useState } from 'react';
import { View, PanResponder, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { colors } from '../theme/tokens';

const COMMUNITY_COLORS = [
  colors.signalBlue, colors.signalTeal, colors.signalAmber,
  colors.signalRose, colors.signalPurple, colors.signalCyan,
];

const HEIGHT = 320;

export default function NetworkGraph({ nodes, edges }) {
  const width = Dimensions.get('window').width - 64;
  const [tick, setTick] = useState(0); // forces a re-render on every simulation tick
  const simRef = useRef(null);
  const nodeDataRef = useRef([]);
  const linkDataRef = useRef([]);

  useEffect(() => {
    if (!nodes?.length) return;

    const nodeData = nodes.map((n) => ({ ...n }));
    const linkData = edges.map((e) => ({ ...e }));
    nodeDataRef.current = nodeData;
    linkDataRef.current = linkData;

    const maxScore = Math.max(...nodeData.map((n) => n.influence_score || 0), 1);

    const simulation = forceSimulation(nodeData)
      .force('link', forceLink(linkData).id((d) => d.id).distance(60).strength(0.35))
      .force('charge', forceManyBody().strength(-140))
      .force('center', forceCenter(width / 2, HEIGHT / 2))
      .force('collide', forceCollide((d) => 6 + (d.influence_score / maxScore) * 12))
      .on('tick', () => setTick((t) => t + 1));

    simRef.current = simulation;
    return () => simulation.stop();
  }, [nodes, edges, width]);

  if (!nodes?.length) return null;

  const nodeData = nodeDataRef.current;
  const linkData = linkDataRef.current;
  const maxScore = Math.max(...nodeData.map((n) => n.influence_score || 0), 1);

  return (
    <View
      style={{ width: '100%', height: HEIGHT, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.bg }}
    >
      <Svg width={width} height={HEIGHT}>
        {linkData.map((l, i) => {
          const s = typeof l.source === 'object' ? l.source : nodeData.find((n) => n.id === l.source);
          const t = typeof l.target === 'object' ? l.target : nodeData.find((n) => n.id === l.target);
          if (!s || !t) return null;
          return (
            <Line
              key={i}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={colors.border}
              strokeOpacity={0.7}
              strokeWidth={1}
            />
          );
        })}

        {nodeData.map((n, i) => (
          <DraggableNode
            key={n.id}
            node={n}
            radius={5 + (n.influence_score / maxScore) * 13}
            color={COMMUNITY_COLORS[(n.community_id ?? 0) % COMMUNITY_COLORS.length]}
            simulation={simRef.current}
            onMove={() => setTick((t) => t + 1)}
          />
        ))}
      </Svg>
    </View>
  );
}

function DraggableNode({ node, radius, color, simulation, onMove }) {
  const startRef = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        simulation?.alphaTarget(0.2).restart();
        startRef.current = { x: node.x, y: node.y };
        node.fx = node.x;
        node.fy = node.y;
      },
      onPanResponderMove: (evt, gesture) => {
        node.fx = startRef.current.x + gesture.dx;
        node.fy = startRef.current.y + gesture.dy;
        onMove();
      },
      onPanResponderRelease: () => {
        simulation?.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      },
    })
  ).current;

  return (
    <G {...panResponder.panHandlers}>
      <Circle
        cx={node.x} cy={node.y} r={radius}
        fill={color} fillOpacity={0.85}
        stroke={colors.bg} strokeWidth={1.5}
      />
      <SvgText
        x={(node.x || 0) + radius + 4}
        y={(node.y || 0) + 3}
        fontSize={9}
        fill={colors.textMid}
      >
        {node.id}
      </SvgText>
    </G>
  );
}
