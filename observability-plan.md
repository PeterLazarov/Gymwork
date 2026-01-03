# Observability Plan (Console Logs Only)

## Purpose
Add **structured console logging** to the data layer so we know **which queries are called, when, and how long they take** across:
- Tanstack Query (logical operations)
- Drizzle/SQLite (actual SQL queries)

No Sentry/OTLP/vendor backends. Console logs only.

---

## Step-by-step plan (middleware-first)
Each step includes **tasks** and a **Done when** checkpoint. There are no extra checkpoints outside the steps.

### Step 1 — Define the log contract + normalization
**Goal:** Lock down the event shape and naming rules before touching code.

**Tasks**
- [ ] Define required fields: `layer`, `op`, `opId`, `startAt`, `endAt`, `durationMs`, `status`.
- [ ] Define optional fields: `queryKey`, `sql`, `params`, `errorName`, `errorMessage`, `cacheHit`.
- [ ] Define naming rules for `op` (format: `domain.action`, e.g., `workouts.getAllFull`).
- [ ] Decide truncation/redaction rules for SQL and params.

**Done when**
- [ ] Log schema + `op` naming conventions are written and agreed for both React Query and Drizzle logs.

---

### Step 2 — Define log-volume rules (incl. slow threshold)
**Goal:** Prevent log spam and make prod logs actionable.

**Tasks**
- [ ] Set **slow query threshold = 100ms**.
- [ ] Define log volume rules:
  - [ ] Dev: log all queries + mutations + DB statements.
  - [ ] Prod: log errors and slow queries only (>100ms).
- [ ] Decide if SQL text is **dev-only** by default.

**Done when**
- [ ] Volume rules and slow threshold are explicitly documented.

---

### Step 3 — Build the logging middleware core
**Goal:** Centralize logging, redaction, and flags in a reusable module.

**Files**
- [ ] `src/utils/observability.ts` (new)

**Tasks**
- [ ] Implement `now()` helpers (`Date.now()`, `new Date().toISOString()`).
- [ ] Implement `scrubParams()` (mask strings/IDs, redact tokens).
- [ ] Implement `shouldLog()` based on flags + slow threshold rules.
- [ ] Implement `logEvent()` / `logError()` that output one JSON line.
- [ ] Implement correlation helpers:
  - [ ] `withOperation(opName, fn)` → logs parent start/end and returns `opId`.
  - [ ] `getActiveOpIds()` → returns active parent `opId`s (supports parallel ops).
- [ ] Export middleware builders:
  - [ ] `createReactQueryLoggerMiddleware()`
  - [ ] `createDrizzleLoggerMiddleware()`

**Done when**
- [ ] Middleware helpers compile and can emit valid JSON logs in isolation.

---

### Step 4 — Wire config flags
**Goal:** Control log volume without code changes.

**Files**
- [ ] `.env.example`
- [ ] `app.config.ts`

**Tasks**
- [ ] Add `LOG_RQ`, `LOG_DB`, `LOG_DB_SQL`, `LOG_DB_PARAMS`, `LOG_SLOW_MS` to `.env.example`.
- [ ] Expose these via `config.extra` in `app.config.ts`.

**Done when**
- [ ] Flags are readable at runtime via `Constants.expoConfig?.extra`.

---

### Step 5 — Add stable operation names to hooks
**Goal:** Ensure logs use readable operation names instead of raw queryKeys.

**Files**
- [ ] `src/db/hooks/useExerciseActions.ts`
- [ ] `src/db/hooks/useSetsActions.ts`
- [ ] `src/db/hooks/useSettingsActions.ts`
- [ ] `src/db/hooks/useWorkoutsActions.ts`
- [ ] `src/db/hooks/useWorkoutStepsActions.ts`

**Tasks**
- [ ] Add `meta: { op: "<domain>.<action>" }` to every `useQuery` and `useMutation`.
- [ ] Keep queryKeys unchanged.

**Done when**
- [ ] All hooks include `meta.op` and React Query logs show those names.

---

### Step 6 — Install React Query logging middleware
**Goal:** Capture query/mutation start/end + durations via a middleware-style hook.

**Files**
- [ ] `src/db/DBProvider.tsx`

**Tasks**
- [ ] Attach `createReactQueryLoggerMiddleware()` to the `QueryClient` (via `QueryCache`/`MutationCache` subscriptions).
- [ ] Track start times in a `Map` keyed by `queryHash` / `mutationId`.
- [ ] Generate an `opId` per fetch/mutation and use `meta.op` for naming.
- [ ] On completion, compute duration and log success/error.
- [ ] Include `cacheHit` when data is served without a fetch.

**Done when**
- [ ] Every query/mutation logs a start and end line with duration.

---

### Step 7 — Install Drizzle logging middleware (main DB)
**Goal:** Log SQL timings and errors at the DB layer using the middleware wrapper.

**Files**
- [ ] `src/db/DBProvider.tsx`
- [ ] `src/db/sqliteLogging.ts` (new helper, if needed)

**Tasks**
- [ ] Wrap the Expo SQLite driver or use Drizzle’s logger hook through `createDrizzleLoggerMiddleware()`.
- [ ] Emit logs with `layer: "drizzle"`, `durationMs`, `status`, plus optional `sql`/`params` based on flags.
- [ ] Attach `opId` (or **array of active opIds**) from `getActiveOpIds()` to support parallel operations.

**Done when**
- [ ] SQL statements emit logs with duration and success/error status.

---

### Step 8 — Install Drizzle logging middleware (storage DB)
**Goal:** Ensure the storage DB uses the same middleware.

**Files**
- [ ] `src/utils/ignite/storage/db.ts`

**Tasks**
- [ ] Wrap storage DB SQLite with `createDrizzleLoggerMiddleware()`.
- [ ] Optionally filter to slow/error logs only to reduce noise.

**Done when**
- [ ] Storage DB queries log with the same schema.

---

### Step 9 — Handle batch/parallel operations explicitly
**Goal:** Log both the *wrapping operation* and each *individual query*.

**Files**
- [ ] `src/utils/useExport.ts`
- [ ] `src/db/expo/*` (seeders)

**Tasks**
- [ ] Wrap export/restore/seed flows with `withOperation("export.restore", async () => { ... })`.
- [ ] Ensure Drizzle logs continue to emit every individual query within the wrapper.
- [ ] Confirm logs for batch ops include both parent op (`opId`) and child query logs.

**Done when**
- [ ] Batch operations emit a parent log plus all child query logs.

---

### Step 10 — Validate instrumentation
**Goal:** Verify correctness, noise level, and usefulness.

**Tasks**
- [ ] Exercise key flows: workouts list, exercise detail, settings update.
- [ ] Run export/restore flow.
- [ ] Confirm log format, durations, and error handling.
- [ ] Toggle flags to confirm log volume control (dev vs prod rules).

**Done when**
- [ ] Logs are structured, correlated, and actionable for slow queries.
