/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./App.js', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // "Netflix black" ground — true near-black, not navy, so green pops
        bg: '#0a0a0a',
        'bg-alt': '#060606',
        panel: '#141414',
        'panel-alt': '#1c1c1c',
        'panel-hi': '#242424',
        border: '#2b2b2b',
        'border-hi': '#3c3c3c',
        hi: '#f7f7f7',
        mid: '#b3b3b3',
        low: '#767676',

        // Brand: neon green replaces the old blue as the primary interactive
        // color (buttons, active tab, focus rings, "live" glow).
        green: '#33e37a',
        'green-dim': '#123322',
        'green-glow': '#7dffb3',

        // Secondary signal colors — desaturated slightly so green still
        // reads as the dominant accent; blue/purple/cyan now exist only to
        // keep the network graph's community colors visually distinct.
        teal: '#33e37a', // alias of brand green: positive sentiment + LIVE badge
        rose: '#ff4d5e', // negative sentiment / SIMULATED badge / errors — used sparingly now
        amber: '#ffb020', // surging trends / PROCESS badge
        blue: '#4f7fe0', // network-graph community color only
        purple: '#b28aef', // network-graph community color only
        cyan: '#4fc3d9', // network-graph community color only
        silver: '#9aa4b2', // neutral sentiment

        positive: '#33e37a',
        negative: '#ff4d5e',
        neutral: '#9aa4b2',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
  plugins: [],
};
