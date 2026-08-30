// Raw hex values for contexts NativeWind can't reach (react-native-svg /
// d3 canvas drawing, chart gradients, ActivityIndicator colors, LinearGradient
// stops). Kept in sync with the palette in tailwind.config.js — if you
// change one, change both.
export const colors = {
  bg: '#0a0a0a',
  bgAlt: '#060606',
  bgPanel: '#141414',
  bgPanelAlt: '#1c1c1c',
  bgPanelHi: '#242424',
  border: '#2b2b2b',
  borderHi: '#3c3c3c',
  textHi: '#f7f7f7',
  textMid: '#b3b3b3',
  textLow: '#767676',

  // Brand neon green — primary interactive color and the "live" signal
  signalGreen: '#33e37a',
  signalGreenDim: '#123322',
  signalGreenGlow: '#7dffb3',

  signalTeal: '#33e37a', // alias of brand green
  signalRose: '#ff4d5e',
  signalAmber: '#ffb020',
  signalBlue: '#4f7fe0', // network-graph community color only
  signalPurple: '#b28aef', // network-graph community color only
  signalCyan: '#4fc3d9', // network-graph community color only
  signalSilver: '#9aa4b2',

  positive: '#33e37a',
  negative: '#ff4d5e',
  neutral: '#9aa4b2',
};

export const fontMono = 'IBM Plex Mono, monospace';
