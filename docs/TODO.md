# TODO Roadmap (Week1 ~ Week8)

## Week1 - Skeleton & Standards

- [x] Initialize Vite + React + TypeScript strict project with pnpm scripts (`dev/lint/typecheck/test/build`)
- [x] Setup ESLint + Prettier + Husky + lint-staged + commitlint
- [x] Setup GitHub Actions CI (lint/typecheck/test/build)
- [x] Create core directory structure (`app/pages/features/ui/lib/types`)
- [x] Implement base UI components (`Button/Input/Card/Skeleton/EmptyState`)
- [x] Initialize README + roadmap docs

## Week2 - Feed MVP (No Virtualization)

- [x] Build feed page with mock dataset 12,000 items
- [x] Implement infinite loading and pagination
- [x] Implement search + category filter
- [x] Implement favorite/unfavorite with localStorage persistence
- [x] Add image lazy loading + skeleton placeholders
- [x] Add loading / empty / error states
- [x] Add baseline entries into `docs/PERF_LOG.md`

## Week3 - Virtualization 1.0

- [x] Implement windowed rendering with overscan
- [x] Ensure smooth scrolling and avoid flickering
- [x] Add perf comparison in `docs/PERF_LOG.md` (before vs after)

## Week4 - Virtualization 2.0 (Dynamic Height)

- [x] Integrate ResizeObserver for dynamic card measurement
- [x] Implement height cache and relayout strategy
- [x] Add scroll position restore (sessionStorage)
- [x] Log strategy and trade-offs in `docs/PERF_LOG.md`

## Week5 - Data & Interaction Enhancements

- [x] Build request layer with cancellation + retry/backoff
- [x] Use TanStack Query for cache and async orchestration
- [x] Add prefetch for next page
- [x] Add lightweight performance debug panel

## Week6 - Accessibility & Stability

- [x] Keyboard accessibility for search/list/detail (Esc to close detail)
- [x] Add global ErrorBoundary + unhandled error capture
- [x] Add unit tests for core utility logic
- [x] Add stability notes in `docs/PERF_LOG.md`

## Week7 - E2E & Release Readiness

- [x] Add Playwright key path e2e
- [x] Define fixed dataset + reproducible perf steps
- [x] Expand README with architecture/perf/known limitations

## Week8 - Polish & Deployment

- [x] Add GitHub Pages deployment workflow
- [x] Final code/doc cleanup
- [x] Complete all roadmap checkboxes and final project summary

## Resume Upgrade Sprint (Post Week8)

- [x] Add route-level `errorElement` and 404 page for better routing UX
- [x] Add favorites management action (clear current page favorites)
- [x] Add second e2e path for favorites management flow
- [x] Add detail image load failure fallback UI
- [x] Expand CI to include e2e validation job
- [x] Strengthen README (user paths, trade-offs, maintenance notes)
- [x] Refine `docs/PERF_LOG.md` with optimization comparison table
