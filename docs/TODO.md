# Community Upgrade TODO

## P0 (Must)

### P0-1 Home Feed Tabs

- [x] Home page supports `推荐/关注` tabs
- [x] Both tabs use masonry + virtualization
- [x] Tab switch keeps independent scroll position
- [x] Each tab has loading/empty/error/retry states

### P0-2 Search Page

- [x] Add `/search` page with keyword search
- [x] Add tag filter
- [x] Add debounced input (client-side)
- [x] Persist search history in localStorage
- [x] Search page has loading/empty/error/retry states

### P0-3 Detail + Comments

- [x] Detail page supports image carousel
- [x] Add paginated comments list
- [x] Add publish comment with retry on failure
- [x] Comment module has loading/empty/error/retry states

### P0-4 Interactions (Login + Optimistic)

- [x] Add mock login state (global)
- [x] Like/Favorite/Follow actions require login
- [x] Implement optimistic update for interactions
- [x] Simulate 10% failure and rollback state

### P0-5 Profile Page

- [x] Add `/profile` page
- [x] Show my favorites
- [x] Show browsing history (last 50)
- [x] Show following list
- [x] Profile module has loading/empty/error/retry states

### P0-6 Stability

- [x] Keep global ErrorBoundary functional
- [x] Add image load fallback placeholders where needed
- [x] Ensure primary modules expose empty/error/retry UX

### P0-7 Quality

- [x] Update Playwright with key path: Home scroll -> Search -> Detail -> Favorite -> Profile verify
- [x] `pnpm lint/typecheck/test/build/e2e` all green
- [x] CI workflow remains green

### P0-8 Docs

- [x] Upgrade README to product-grade documentation
- [x] Update `docs/PERF_LOG.md` with baseline + at least two optimization comparisons + reproducible steps

## P1 (Bonus)

### P1-1 Perf Panel

- [x] Add hidden performance panel entry
- [x] Show rendered item count / overscan / cache size
- [x] Support virtualization on/off comparison

### P1-2 Experience

- [x] Keep next-page prefetch and list position restore behavior stable

### P1-3 Optional Worker

- [x] Evaluate worker-based search/filter (deferred: documented as next step)
