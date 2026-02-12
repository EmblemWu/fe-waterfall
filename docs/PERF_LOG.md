# Performance Log

## Week2 Baseline (No Virtualization)

- Scenario: Feed page with `12,000` total items, loaded in pages of `80`.
- Device/Browser: macOS + Chrome (dev mode).
- Observation:
  - Continuous loading without virtualization quickly increases DOM nodes to 600+ cards after several scroll screens.
  - Search/filter response stays acceptable on first pages, but long-session memory and layout cost rises.
- Baseline Metrics (manual observation):
  - DOM card nodes after deep scroll: `~600+`
  - Scroll smoothness: occasional frame drops when images continue loading.

## Week3 Virtualization 1.0

- Strategy: absolute-positioned masonry + visible window filtering with `overscan=900`.
- Result vs baseline:
  - Rendered card nodes reduced from `600+` to typically `50~130` (depends on viewport and overscan).
  - Scroll interaction subjectively smoother, fewer large style/layout recalculations.
- Key metrics:
  - DOM nodes in viewport session: `~80` average
  - Perceived jank: significantly reduced.

## Week4 Virtualization 2.0

- Strategy:
  - Dynamic card measurement using `ResizeObserver`.
  - Height cache (`Map<itemId, height>`) used for stable relayout.
  - Session scroll restoration based on filter key.
- Trade-off:
  - Relayout can still occur when many images finish loading at once.
  - Cache sharply improves next pass stability and avoids repeated estimate errors.
- Outcome:
  - Less scroll jump than estimated-height-only approach.
  - Re-visiting feed under same filter restores previous position.

## Week6 Stability & UX Improvements

- Added global ErrorBoundary and unhandled error logging.
- Added fallback UI for load/error/empty states across primary pages.
- Added keyboard support improvements:
  - Search input and cards are tab-focusable.
  - Detail page supports `Esc` back navigation.
- Result:
  - Better resilience under request failure and runtime error conditions.

## Week7 Repro Steps (Regression)

- Dataset: deterministic local mock dataset `12000` rows (`src/lib/mockData.ts`).
- Repro path:
  1. Open Feed page.
  2. Scroll down 6~8 viewport heights.
  3. Search `Aurora` and switch category.
  4. Open first detail and toggle favorite.
- Expected:
  - Virtualized render count remains bounded (debug panel).
  - No large blank flashes during scroll.
