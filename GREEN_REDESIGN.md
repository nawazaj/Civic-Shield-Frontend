# Civic Shield — black / neon-green redesign

This pass restyles the previous NativeWind build and adds a set of new
interactive features. Verified with a full Metro production bundle
(`npx expo export:embed`, 2978 modules resolved with no errors) and a
Tailwind CLI compile check — not just a syntax read-through.

## Palette change

The old scheme was blue-led with a fairly saturated red used everywhere
(brand buttons, tabs, "surging" trend badges, focus rings). That's what read
as "boring and too red."

New palette (`tailwind.config.js` + `src/theme/tokens.js`, kept in sync):

| Role | Before | Now |
|---|---|---|
| Background | `#080d18` (navy) | `#0a0a0a` (true near-black, Netflix ground) |
| Panels | `#0f1729` | `#141414` / `#1c1c1c` |
| Brand / primary interactive | blue `#5b8def` | neon green `#33e37a` |
| "Surging" trend badge | red `#f3546f` | amber `#ffb020` *(see fix below)* |
| "Rising" trend badge | amber | green |
| Negative sentiment / errors / SIMULATED tag | red | red — kept, but now the *only* place red appears, so it reads as a deliberate warning color instead of the dominant hue |

Also fixed a real bug while in there: "surging" trends were badged **red**
before, which reads as an alarm rather than a highlight. Surging is now
amber (hot/urgent), rising is green (positive movement), declining is grey.

`signalBlue`/`signalPurple`/`signalCyan` still exist as real hex values, but
only for the network graph's community-color palette, where six visually
distinct hues are load-bearing — everywhere else that used to reach for
"blue" (buttons, tabs, focus rings, demographic bars) now uses `green`.

## New: flashcards ("Top Moving Topics")

`src/components/TrendStories.js` — a horizontal, one-at-a-time paging
carousel (Instagram-stories interaction, Netflix-Top-10 visual language):
a giant SVG-outlined rank numeral behind each card, a colored glow border
matching the trend's status, and dot pagination underneath.

**Tapping a card is a real feature, not decoration** — it navigates to the
Propagation tab pre-filtered to that topic (`onSelectTopic` → 
`navigation.navigate('Propagation', { topic })`), so the flashcards are an
entry point into the cascade view, not just a pretty row.

## Other additions

- **`HeroBanner.js`** — a Netflix "featured title"-style banner at the top
  of Overview: dominant sentiment as a huge percentage, colored to match
  (green/red/grey), with a live pulse dot.
- **`SkeletonOverview.js`** — shimmer placeholders during first load instead
  of a plain "loading" text block.
- **Pull-to-refresh** on Overview, Timeline, and Propagation (`RefreshControl`,
  tinted green).
- **LIVE auto-refresh toggle** on Overview — flip it on and the dashboard
  silently re-polls every 15s in the background (`AUTO_REFRESH_INTERVAL_MS`
  in `OverviewScreen.js`). A failed background poll doesn't clobber the
  screen with an error state; only a failed *manual* refresh does that.
- **Haptic feedback** (`expo-haptics`, new dependency) — a light tap on every
  button press, and a success/error notification haptic when an ingestion
  action on the Data Sources screen finishes.

## Files touched

```
tailwind.config.js                       palette
src/theme/tokens.js                       palette (raw hex mirror)
src/components/ui/Button.js               brand color + haptic tap
src/components/ui/Input.js                focus color
src/components/DemographicsPanel.js       bar fill color
src/components/PropagationFeed.js         platform tag color
src/components/TrendTicker.js             fixed surging/rising color semantics
App.js                                    nav theme, tab color, header glow
src/screens/OverviewScreen.js             hero banner, stories, skeleton,
                                           pull-to-refresh, LIVE toggle
src/screens/TimelineScreen.js             pull-to-refresh
src/screens/PropagationScreen.js          pull-to-refresh, reads ?topic param
src/screens/IngestScreen.js               success/error haptics
package.json                              + expo-haptics
```

New files: `src/components/TrendStories.js`, `src/components/HeroBanner.js`,
`src/components/SkeletonOverview.js`.

## Setup (unchanged)

```bash
cd civic-shield-expo
npm install
npx expo start
```

If Metro complains about the CSS import after pulling this update, clear the
cache: `npx expo start -c`.
