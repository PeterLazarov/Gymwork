# Development Leads Backlog

Updated: 2026-02-19
Scope: Combined `TODO.md` + reported bugs/feature requests from user notes.

## Priority and Difficulty Scale
- Priority:
  - `P0` = critical correctness/usability, should be done first
  - `P1` = high impact, near-term roadmap
  - `P2` = medium impact, quality/product depth
  - `P3` = low urgency, polish/experiments
- Difficulty:
  - `D1` = small (hours)
  - `D2` = small-medium (1-2 days)
  - `D3` = medium (2-4 days)
  - `D4` = large (4-8 days)
  - `D5` = very large / multi-sprint

## Top Priority Initiatives

### 1) Finish Muscle Map Optimization (P0, D4)
- Source: `muscle-map-optimisation.md` (previously dropped after no progress)
- Goal: complete the initiative with a reset scope and measurable milestones
- Delivery framing:
  - Baseline current performance and UX issues
  - Break work into small shippable milestones
  - Add acceptance metrics (render time, interaction smoothness, memory budget)
  - Ship incrementally with tests per milestone

### 2) Testing Strategy Rollout (P0, D4)
#### Item
Build a test pyramid for workout flows before major feature expansion.

#### Analysis: Unit vs Integration vs E2E
- Unit tests: fastest ROI for logic-heavy modules.
  - Best for: timer math, set/volume calculations, search ranking/scoring, data transforms, selectors.
  - Goal: prevent regressions in core behavior with fast CI feedback.
- Integration tests: highest value for this app’s architecture.
  - Best for: screen + hooks + DB service interactions (`Workout`, `WorkoutStep`, `ExerciseList`, rest timer state transitions).
  - Goal: validate real user behaviors across components without full device-level flake.
- E2E tests: use sparingly for mission-critical journeys.
  - Best for: cache invalidation and end-to-end state consistency across exercise, workout step, and history flows.
  - Goal: confidence on release gates and device/runtime-specific bugs.

#### E2E Setup (Maestro)
- **Framework**: Maestro 2.x (YAML-based, no native build modifications)
- **Location**: `.maestro/flows/` for test flows, `.maestro/shared/` for reusable setup flows
- **App ID**: `com.gymwork`
- **Run locally**:
  1. Start Metro in E2E mode: `pnpm start:e2e` (skips workout seeds via `EXPO_PUBLIC_SKIP_WORKOUT_SEEDS`)
  2. Run tests: `pnpm test:maestro` (requires `JAVA_HOME` set, iOS simulator or Android emulator with dev build)
- **Test data strategies** (in order of preference):
  1. **Reusable Maestro flows** — create data through the UI via shared `.yaml` flows with `env` parameters. Best for simple setups and when the creation flow itself is being tested.
  2. **Deep link test seeds** — add a dev-only deep link handler (`BodyBuilder://test-seed/<preset>`) that runs DB inserts directly using Drizzle. Triggered from Maestro via `openLink`. Best for complex data setups (e.g., workout with multiple exercises, sets, supersets) where UI-driven creation would be too slow.

- **Known issues**:
  - **Keyboard dismiss causes lost taps (Android)**: After dismissing the keyboard (e.g., tapping a header or non-input element), subsequent `tapOn` commands may silently fail to trigger `onPress` on `Pressable` components. This is caused by the layout reflow from `react-native-keyboard-controller`'s keyboard animation — element positions shift and Maestro taps at stale coordinates. **Workaround**: reorder test steps so text input happens after all tap-based interactions (selects, toggles, etc.), or avoid dismissing the keyboard mid-flow.

#### Recommendation
- Initial acceptance:
  - Add test harness and CI gates for changed code paths.
  - Add minimum critical E2E smoke suite from `TODO.md` scenarios:
    - Deleting an exercise removes plain steps and sets from current workout view immediately.
    - Deleting an exercise used in a superset removes only its sets from the superset step while keeping the step.
  - Backfill tests for each `P0`/`P1` fix in this document.

---

## Prioritized Backlog

### P0 (Critical)
| Item | Source | Difficulty | Notes |
|---|---|---:|---|
| Investigate `TopNavigation` `independent` prop removal | Code cleanup (2026-03-04) | D1 | Removed `independent` from `NavigationContainer` since `NavigationIndependentTree` wrapper is already used. Verify this doesn't break nested navigation or tab behavior on both platforms. |
| Rest timer continues correctly when app is minimized/backgrounded | Bug (Kamen, 2024-10-21) | D4 | Requires app lifecycle handling and robust resume logic |
| Fix rest timer start button reliability | TODO | D2 | Bugfix and state transition hardening |
| Fix rest timer typing (`Partial` type issue) | TODO | D1 | Type safety + potential runtime guard |
| Cannot edit rest value | Bug (Kamen, 2024-09-21) | D2 | Input/edit flow regression |
| Cannot use timer as duration input | Bug (Kamen, 2024-09-21) | D2 | Connect timer UI to duration field path |
| If all sets are warmup, workout handling is incorrect | Bug (Kamen, 2024-09-26) | D2 | Business rule/edge case fix |
| Exercise best search match should rank first | Bug (Kamen, 2025-12-31) | D2 | Search scoring/ranking update |
| Long exercise names overflow and can’t be read | Bug (Kamen, 2026-01-03) | D2 | Truncation + accessible full text affordance |
| Import data ignores pull-up records | Bug (Peter, 2024-09-21) | D3 | Import parser + migration/backfill |
| Cannot scroll left (snaps back) | Bug (Kamen, 2024-09-28) | D3 | Gesture/list physics issue |
| Split screen layout breaks | Bug (Peter, 2024-09-21) + TODO | D3 | Responsive layout hardening |
| Splash screen shows black background with white circle artifact | Bug (Kamen, 2026-01-03) | D2 | Asset/config fix for splash rendering |

### P1 (High)
| Item | Source | Difficulty | Notes |
|---|---|---:|---|
| Set/create superset relation after exercises are already added | Bug (Stefi, 2025-12-08) | D4 | Data model + UI affordance |
| Swipe to change items in superset | Bug (Ivo, 2024-10-09) | D3 | Gesture support in superset context |
| Copy workout while browsing old workouts | Bug (Kamen, 2024-10-14) | D2 | Strong user value for planning/repeatability |
| Add images and notes to a workout step | Bug (Peter, 2026-02-19) | D4 | New schema, storage, UI, sync/export considerations |
| Comment per set | Bug (Kamen, 2024-10-21) | D3 | Data model extension + UI edit/display |
| Add pain/discomfort comments field in workout flow | Bug (Peter, 2025-06-24) | D2 | Feedback schema + form UX |
| Planks as duration exercise where “more is better” | Bug (Peter, 2025-06-16) | D3 | Duration-first tracking and PB logic |
| Add first set as warmup by default | Bug (Kamen, 2024-10-11) | D2 | Configurable defaulting behavior |
| Chair leg raise with weight data quality issue | Bug (Peter, 2025-06-16) | D2 | Data cleanup + validation rule |
| Step mill chart missing speed metric | Bug (Peter, 2024-10-07) | D3 | Chart series + unit support |
| Record highlight in tracking/history | Bug (Peter, 2024-10-09) | D2 | UI emphasis logic |
| Workout timer improvements | TODO | D3 | Consolidate with rest timer work |
| Set rest timer feature completion | TODO | D3 | Consolidate with P0 timer fixes |
| List rest time in workout chart | TODO | D2 | Chart data model + render |
| Optimize set insert/remove latency | TODO | D3 | Performance profiling and batching |

### P2 (Medium)
| Item | Source | Difficulty | Notes |
|---|---|---:|---|
| Long press workout exercise to show details (as in exercise selection) | Bug (Peter, 2025-06-16) | D2 | Discoverability/value enhancement |
| Long press workout review item to full-screen muscle map | Bug (Peter, 2025-06-16) | D2 | Review UX enhancement |
| Fork exercise / create variation while keeping image metadata | Bug (Fork exercise?, 2025-12-31) | D4 | Entity cloning/versioning |
| Thumbnails for muscle groups | Bug (Ivo, 2024-09-21) | D2 | Asset + list rendering |
| Chart volume shows point for every day (aggregation issue) | Bug (Petet, 2024-10-04) | D3 | Grouping/binning logic |
| Try chart with press-to-interact | Bug (Peter, 2024-09-23) | D2 | Interaction layer on chart |
| 1RM calculation in records | TODO | D2 | Formula + display context |
| Show muscle icons in exercise name | TODO | D2 | Readability enhancement |
| Bodyweight exercise handling improvements | TODO | D3 | Tracking model consistency |
| Exercise instructions/tips `string[]` structure cleanup | TODO | D2 | Data typing/normalization |
| Fix invisible divider in `WorkoutFilterModal` | TODO | D1 | Quick UI bugfix |
| `IconButton` underlay prop not working | TODO | D2 | Component prop behavior |
| Superset select screen should list selected exercises | TODO | D2 | Selection clarity |
| Why are imageUri entries missing in `exerciseImages` map | TODO | D2 | Data consistency audit |
| Make initial chart load faster / empty-state strategy | TODO | D3 | UX + perf tuning |
| Speed exercise measurement currently unused | TODO | D2 | Either implement or remove dead path |
| Ensure `Modal` `onClose` isn’t called twice | TODO | D2 | Event sequencing fix |

### P3 (Low / Polish / Experiments)
| Item | Source | Difficulty | Notes |
|---|---|---:|---|
| Look into React Native `InteractionManager` for render optimization | TODO | D2 | Profiling-led decision |
| Fix seed to use actual data | TODO | D2 | Dev quality |
| Brainstorm exercise image generation process | TODO | D3 | Product/content workflow |
| Compact inline editing for set values (experiment) | TODO | D3 | UX experiment |
| Change to hierarchical translation keys | TODO | D3 | Refactor/maintainability |
| Favorite exercise button animation/effect | TODO | D1 | Visual polish |
| Get full typing of Ant Design icons in `Icon` component | TODO | D2 | DX/type safety |
| Disabled button style is poor/unified | TODO | D2 | Design system cleanup |

## Suggested Delivery Order (Roadmap)
1. Complete muscle map optimization with milestone-based execution and metrics.
2. Stabilize reliability first: timers, edit flows, search ranking, overflow/readability, import correctness, split-screen/scroll bugs.
3. Build feature depth second: supersets, step notes/images, set comments, workout-copy flow, duration-first exercises.
4. Improve analytics/perf third: chart correctness/performance, record highlighting, 1RM and metrics quality.
5. Tackle refactors/UX polish last: translation keys, icon typing, style polish, interaction experiments.
