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
- [x] Define required fields: `layer`, `op`, `opId`, `startAt`, `endAt`, `durationMs`, `status`.
- [x] Define optional fields: `queryKey`, `sql`, `params`, `errorName`, `errorMessage`, `cacheHit`.
- [x] Define naming rules for `op` (format: `domain.action`, e.g., `workouts.getAllFull`).
- [x] Decide truncation/redaction rules for SQL and params.

**Done when**
- [x] Log schema + `op` naming conventions are written and agreed for both React Query and Drizzle logs.

---

### Step 2 — Define log-volume rules (incl. slow threshold)
**Goal:** Prevent log spam and make prod logs actionable.

**Tasks**
- [x] Set **slow query threshold = 100ms**.
- [x] Define log volume rules:
  - [x] Dev: log all queries + mutations + DB statements.
  - [x] Prod: log errors and slow queries only (>100ms).
- [x] Decide if SQL text is **dev-only** by default.

**Done when**
- [x] Volume rules and slow threshold are explicitly documented.

#### Defined Rules (Documentation)
1.  **Slow Query Threshold**: Operations taking longer than **100ms** are considered "slow" and will be logged even in production if they exceed this duration.
2.  **Environment Rules**:
    *   **Development**: Log ALL queries, mutations, and DB statements. Include SQL text and parameters.
    *   **Production**: Log ONLY:
        *   Errors (always).
        *   Slow queries (>100ms).
    *   **SQL Text/Params**: By default, SQL text and parameters are **Dev-only**. In production, they are redacted/omitted unless explicitly enabled via specific flags (for debugging).

---

### Step 3 — Build the logging middleware core
**Goal:** Centralize logging, redaction, and flags in a reusable module.

**Files**
- [x] `src/utils/observability.ts` (new)

**Tasks**
- [x] Implement `now()` helpers (`Date.now()`, `new Date().toISOString()`).
- [x] Implement `scrubParams()` (mask strings/IDs, redact tokens).
- [x] Implement `shouldLog()` based on flags + slow threshold rules.
- [x] Implement `logEvent()` / `logError()` that output one JSON line.
- [x] Implement correlation helpers:
  - [x] `withOperation(opName, fn)` → logs parent start/end and returns `opId`.
  - [x] `getActiveOpIds()` → returns active parent `opId`s (supports parallel ops).
- [x] Export middleware builders:
  - [x] `createReactQueryLoggerMiddleware()`
  - [x] `createDrizzleLoggerMiddleware()`

**Done when**
- [x] Middleware helpers compile and can emit valid JSON logs in isolation.

---

### Step 4 — Wire config flags
**Goal:** Control log volume without code changes.

**Files**
- [x] `.env.example`
- [x] `app.config.ts`

**Tasks**
- [x] Add `LOG_RQ`, `LOG_DB`, `LOG_DB_SQL`, `LOG_DB_PARAMS`, `LOG_SLOW_MS` to `.env.example`.
- [x] Expose these via `config.extra` in `app.config.ts`.

**Done when**
- [x] Flags are readable at runtime via `Constants.expoConfig?.extra`.

---

### Step 5 — Add stable operation names to hooks
**Goal:** Ensure logs use readable operation names instead of raw queryKeys.

**Files**
- [x] `src/db/hooks/useExerciseActions.ts`
- [x] `src/db/hooks/useSetsActions.ts`
- [x] `src/db/hooks/useSettingsActions.ts`
- [x] `src/db/hooks/useWorkoutsActions.ts`
- [x] `src/db/hooks/useWorkoutStepsActions.ts`

**Tasks**
- [x] Add `meta: { op: "<domain>.<action>" }` to every `useQuery` and `useMutation`.
- [x] Keep queryKeys unchanged.

**Done when**
- [x] All hooks include `meta.op` and React Query logs show those names.

---

### Step 6 — Install React Query logging middleware
**Goal:** Capture query/mutation start/end + durations via a middleware-style hook.

**Files**
- [x] `src/db/DBProvider.tsx`

**Tasks**
- [x] Attach `createReactQueryLoggerMiddleware()` to the `QueryClient` (via `QueryCache`/`MutationCache` subscriptions).
- [x] Track start times in a `Map` keyed by `queryHash` / `mutationId`.
- [x] Generate an `opId` per fetch/mutation and use `meta.op` for naming.
- [x] On completion, compute duration and log success/error.
- [x] Include `cacheHit` when data is served without a fetch.

**Done when**
- [x] Every query/mutation logs a start and end line with duration.

---

### Step 7 — Install Drizzle logging middleware (main DB)
**Goal:** Log SQL timings and errors at the DB layer using the middleware wrapper.

**Files**
- [x] `src/db/DBProvider.tsx`
- [x] `src/utils/observability.ts` (updated with `createDrizzleLoggerMiddleware`)

**Tasks**
- [x] Wrap the Expo SQLite driver or use Drizzle’s logger hook through `createDrizzleLoggerMiddleware()`.
- [x] Emit logs with `layer: "drizzle"`, `durationMs`, `status`, plus optional `sql`/`params` based on flags.
- [x] Attach `opId` (or **array of active opIds**) from `getActiveOpIds()` to support parallel operations.

**Done when**
- [x] SQL statements emit logs with duration and success/error status.

---

### Step 8 — Install Drizzle logging middleware (storage DB)
**Goal:** Ensure the storage DB uses the same middleware.

**Files**
- [x] `src/utils/ignite/storage/db.ts`

**Tasks**
- [x] Wrap storage DB SQLite with `createDrizzleLoggerMiddleware()`.
- [x] Optionally filter to slow/error logs only to reduce noise.

**Done when**
- [x] Storage DB queries log with the same schema.

---

### Step 9 — Handle batch/parallel operations explicitly
**Goal:** Log both the *wrapping operation* and each *individual query*.

**Files**
- [x] `src/utils/useExport.ts`
- [x] `src/db/expo/*` (seeders)

**Tasks**
- [x] Wrap export/restore/seed flows with `withOperation("export.restore", async () => { ... })`.
- [x] Ensure Drizzle logs continue to emit every individual query within the wrapper.
- [x] Confirm logs for batch ops include both parent op (`opId`) and child query logs.

**Done when**
- [x] Batch operations emit a parent log plus all child query logs.

---

### Step 10 — Validate instrumentation
**Goal:** Verify correctness, noise level, and usefulness.

**Tasks**
- [x] Exercise key flows: workouts list, exercise detail, settings update.
- [x] Run export/restore flow.
- [x] Confirm log format, durations, and error handling.
- [x] Toggle flags to confirm log volume control (dev vs prod rules).

**Done when**
- [x] Logs are structured, correlated, and actionable for slow queries.
