# Performance Log

## Test Context

- Dataset: deterministic local mock dataset (`12000`) from `src/lib/mockData.ts`
- Device/Browser: macOS + Chrome
- Feed mode: infinite pagination (`80/page`) + masonry cards

## Baseline (Week2, No Virtualization)

- Scenario: deep scrolling 6~8 viewport heights with image loading enabled
- Observation:
  - DOM card nodes continuously grow with scroll depth
  - filter/search interaction starts to show delay after long scrolling sessions
- Baseline metrics (manual + devtools sampling):
  - Rendered card nodes: `~600+`
  - Scroll smoothness: occasional visible jank

## Optimization #1 (Week3, Virtualization 1.0)

- Change:
  - Added windowed rendering for masonry items
  - Added overscan window to prevent edge flicker
- Comparison:
  - Rendered nodes reduced to `~50-130`
  - Scroll smoothness visibly improved under the same dataset

## Optimization #2 (Week4, Dynamic Height + Cache)

- Change:
  - Added `ResizeObserver` measurement
  - Added height cache by item id
  - Added scroll position restoration by filter key
- Comparison:
  - Less layout jump than fixed-estimation-only strategy
  - Return navigation restores previous reading position

## Optimization #3 (Week5/6, Request & Stability)

- Change:
  - Added cancel/retry/backoff in request layer
  - Added loading/empty/error/retry states and global error capture
- Comparison:
  - Failure scenarios now have deterministic UI fallback
  - Perceived stability improved when request/image resources fail

## Summary Table

| Stage    | Main change                    | Rendered cards (typical) | User-visible result                  |
| -------- | ------------------------------ | ------------------------ | ------------------------------------ |
| Baseline | No virtualization              | 600+                     | long scroll starts janking           |
| Opt #1   | windowed masonry + overscan    | 50-130                   | smoother scroll, lower DOM pressure  |
| Opt #2   | dynamic measure + height cache | 50-130                   | fewer jumps, better restore behavior |
| Opt #3   | request + error resilience     | 50-130                   | fail-safe states and retry path      |

## Repro Steps (Regression)

1. Open `/` and scroll down 6~8 screens.
2. Search `Aurora`, switch category, continue scrolling.
3. Open first detail item and toggle favorite.
4. Navigate to `/favorites`, clear favorites, and return to feed.

Expected:

- Virtualized rendered count remains bounded (debug panel)
- No large blank regions during normal scroll
- Error/empty/retry/fallback states are reachable and readable
