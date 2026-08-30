# Civic Shield — NativeWind / Reusables restyle

## What changed

**Styling engine**
- Added **NativeWind v4** (Tailwind for React Native) — `tailwind.config.js`, `global.css`,
  `metro.config.js` (wraps Metro with `withNativeWind`), and the `nativewind/babel` preset in
  `babel.config.js`. Every screen and component now styles with `className` instead of
  `StyleSheet.create`.
- The old `colors` object in `src/theme/tokens.js` became the Tailwind palette in
  `tailwind.config.js` (`bg`, `panel`, `hi`, `mid`, `low`, `teal`, `rose`, `amber`, `blue`,
  `purple`, `cyan`, `positive`/`negative`/`neutral`). `tokens.js` still exports the raw hex
  values, because `react-native-svg` and `d3` (the network graph, timeline chart, sentiment
  donut) draw on a `<Canvas>`-like surface that NativeWind classes can't reach — **keep the two
  files' colors in sync if you rebrand.**

**React Native Reusables (reactnativereusables.com)**
The CLI pulls components from their hosted registry, which wasn't reachable from this sandbox,
so I hand-built the same pattern instead — `src/lib/utils.js` has the exact `cn()` helper
(clsx + tailwind-merge) they use, and `src/components/ui/` has `Button`, `Card`, `Badge`, and
`Input` written the same way: plain RN primitives, `class-variance-authority` for variants,
`className` for styling, no dependency on their registry at build time. On your machine you can
run their actual CLI (`npx react-native-reusables add ...`) to pull in more components (Dialog,
Select, Tabs, etc.) — they'll drop into `src/components/ui/` next to these and use the same `cn()`.

**Motion ("flash")**
- **react-native-reanimated** powers entrance animations (cards fade/slide in with a staggered
  `delay`), the `Button` press-scale, and animated demographic bar fills.
- `src/components/ui/PulseDot.js` is a soft breathing glow (used for the header's live/API-status
  dot) — an expanding, fading halo behind a solid dot, all on the UI thread.
- **@shopify/flash-list** replaced the plain `.map()` lists for the propagation cascade feed
  (`PropagationFeed.js`) — recycles rows instead of mounting all of them, so it stays smooth as
  the feed grows past dozens of posts.

**Visual pass**
- Header: gradient bar, app icon badge, animated live-status pulse.
- Bottom tabs: icons (`lucide-react-native`) instead of text-only labels.
- Stat cards: thin gradient accent strip per card (`expo-linear-gradient`).
- Ingest cards: proper `Badge` components for LIVE/SIMULATED/PROCESS instead of colored text.
- Sentiment donut: total % now sits in the center of the ring.
- Influencer list: numbered rank medallions instead of a bare `#1`.
- All panels/cards/list rows: staggered fade-in-from-below on mount.

## Setup

```bash
cd civic-shield-expo
npm install
npx expo start
```

First run after installing NativeWind, if Metro complains about the CSS import, clear the cache:
```bash
npx expo start -c
```

Nothing about the backend contract changed — `src/api/client.js` and `src/config.js` are
untouched, so point `API_BASE_URL` in `src/config.js` at your FastAPI server as before.

## If you want to go further

- Run the real `react-native-reusables` CLI locally to pull in more primitives (Dialog, Sheet,
  Tabs, Select) — they're designed to sit next to what's already in `src/components/ui/`.
- The Overview screen's stat cards and panels take a `delay` prop for the stagger — reorder or
  retime them there.
- `PulseDot` is reusable anywhere you want a "live" indicator (e.g. next to the LIVE badges on
  ingest cards).
