import Constants from 'expo-constants';

export type LogLayer = 'react-query' | 'drizzle' | 'system';
export type LogStatus = 'ok' | 'error' | 'warning';

/**
 * Structured Log Event Contract
 */
export interface LogEvent {
  layer: LogLayer;
  op: string;
  opId: string;
  startAt: string;
  endAt: string;
  durationMs: number;
  status: LogStatus;
  queryKey?: string;
  sql?: string;
  params?: unknown[];
  errorName?: string;
  errorMessage?: string;
  cacheHit?: boolean;
  activeOpIds?: string[];
}

export const NAMING_CONVENTION_REGEX = /^[a-z]+\.[a-zA-Z0-9]+$/;

export const LOG_CONFIG = {
  MAX_SQL_LENGTH: 500,
  MAX_ERROR_LENGTH: 1000,
  SENSITIVE_KEYS: ['password', 'token', 'secret', 'auth', 'key'],
  SLOW_THRESHOLD_MS: 100,
} as const;

// --- Internal State ---
const activeOpIds = new Set<string>();

// --- Helpers ---

export const now = () => new Date().toISOString();

function isDev(): boolean {
  return __DEV__;
}

function getConfig(key: string, defaultVal?: any) {
  return Constants.expoConfig?.extra?.[key] ?? defaultVal;
}

/**
 * Masks sensitive keys in objects/arrays.
 */
export function scrubParams(params: any): any {
  if (!params) return params;
  
  if (Array.isArray(params)) {
    return params.map(scrubParams);
  }
  
  if (typeof params === 'object') {
    // Check if it's a simple object
    if (params.constructor !== Object) return params; // Date, etc.

    const newObj: any = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = LOG_CONFIG.SENSITIVE_KEYS.some(k => lowerKey.includes(k));
        
        if (isSensitive) {
          newObj[key] = '***';
        } else {
          newObj[key] = scrubParams(params[key]);
        }
      }
    }
    return newObj;
  }
  
  return params;
}

/**
 * Determines if an event should be logged based on rules and flags.
 */
export function shouldLog(layer: LogLayer, isError: boolean, durationMs: number): boolean {
  const configuredThreshold = getConfig('LOG_SLOW_MS');
  const slowThreshold = Number(configuredThreshold) || LOG_CONFIG.SLOW_THRESHOLD_MS;
  const isSlow = durationMs >= slowThreshold;
  
  // Rule 1: Always log errors
  if (isError) return true;

  // Rule 2: If LOG_SLOW_MS is explicitly set, use it as a filter (even in dev)
  if (configuredThreshold !== undefined) {
    return isSlow;
  }

  // Rule 3: Dev defaults -> Log everything (only if no threshold configured)
  if (isDev()) return true;

  // Rule 4: Prod defaults -> Log slow queries or if flags enabled
  if (isSlow) return true;
  if (layer === 'react-query' && getConfig('LOG_RQ')) return true;
  if (layer === 'drizzle' && getConfig('LOG_DB')) return true;

  return false;
}

/**
 * Formats and emits the log line.
 */
export function logEvent(event: LogEvent) {
  const shouldLogEvent = shouldLog(event.layer, event.status !== 'ok', event.durationMs);
  if (!shouldLogEvent) return;

  // Redaction for SQL/Params based on env
  let finalSql = event.sql;
  let finalParams = event.params;

  const forceSql = getConfig('LOG_DB_SQL');
  const forceParams = getConfig('LOG_DB_PARAMS');
  
  // Default: Hide SQL/Params in Prod unless forced or Dev
  const showDetails = isDev() || forceSql || forceParams;

  if (!showDetails) {
    if (finalSql) finalSql = '[REDACTED]';
    if (finalParams) finalParams = ['[REDACTED]'];
  } else {
    // Truncate SQL if too long
    if (finalSql && finalSql.length > LOG_CONFIG.MAX_SQL_LENGTH) {
      finalSql = finalSql.substring(0, LOG_CONFIG.MAX_SQL_LENGTH) + '...';
    }
    // Scrub params
    finalParams = scrubParams(finalParams);
  }

  const logPayload = {
    ...event,
    sql: finalSql,
    params: finalParams,
    activeOpIds: getActiveOpIds(), // Attach context
  };

  console.log(JSON.stringify(logPayload));
}

export function logError(layer: LogLayer, op: string, error: any, context?: Partial<LogEvent>) {
  const startAt = context?.startAt ?? now();
  const endAt = now();
  const durationMs = context?.durationMs ?? 0;
  
  logEvent({
    layer,
    op,
    opId: context?.opId ?? 'unknown',
    startAt,
    endAt,
    durationMs,
    status: 'error',
    errorName: error?.name ?? 'Error',
    errorMessage: (error?.message ?? String(error)).substring(0, LOG_CONFIG.MAX_ERROR_LENGTH),
    ...context,
  });
}

// --- Correlation Helpers ---

export function getActiveOpIds(): string[] {
  return Array.from(activeOpIds);
}

/**
 * Wraps an operation with logging and context tracking.
 */
export async function withOperation<T>(
  opName: string, 
  fn: (opId: string) => Promise<T>
): Promise<T> {
  const opId = Math.random().toString(36).substring(2, 10);
  const startAt = now();
  const startTime = Date.now();
  
  activeOpIds.add(opId);
  
  // Optional: Log start? (Noise vs Utility). Keeping it silent until end as per Plan "Done when: logs start and end" in Step 6?
  // Actually Step 3 just says "logs parent start/end". 
  // Let's log start in Dev for debugging if needed, but mainly we want the result log.
  // We'll follow the "Done when" of Step 6 "Every query/mutation logs a start and end line"
  // So yes, let's log start.
  if (isDev()) {
    console.log(JSON.stringify({ layer: 'system', op: opName, opId, status: 'started', startAt }));
  }

  try {
    const result = await fn(opId);
    
    const durationMs = Date.now() - startTime;
    logEvent({
      layer: 'system',
      op: opName,
      opId,
      startAt,
      endAt: now(),
      durationMs,
      status: 'ok',
    });
    
    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logError('system', opName, error, { opId, startAt, durationMs });
    throw error;
  } finally {
    activeOpIds.delete(opId);
  }
}

// --- Middleware Builders ---

export function createReactQueryLoggerMiddleware(queryClient: any) {
  const queryCache = queryClient.getQueryCache();
  const mutationCache = queryClient.getMutationCache();
  const startTimes = new Map<string, { start: number, opId: string }>();

  // Helper to get op name safely
  const getOp = (item: any) => item.meta?.op ?? 'unknown';

  // --- Queries ---
  // We hook into the cache subscription to see when queries start/finish
  // Note: V5 has slightly different events, assuming V4/V5 standard events
  
  queryCache.subscribe((event: any) => {
    if (!event) return;
    
    const query = event.query;
    const queryHash = query.queryHash;
    const op = getOp(query);

    if (event.type === 'observerAdded') {
        // Potential cache hit check could go here if we want to log hits without fetch
        // But 'updated' with status 'success' and no fetch is trickier to isolate without granular events
    }

    if (event.type === 'updated') {
        const { status, fetchStatus } = query.state;
        
        // Fetch started
        if (fetchStatus === 'fetching' && !startTimes.has(queryHash)) {
            const opId = Math.random().toString(36).substring(2, 10);
            startTimes.set(queryHash, { start: Date.now(), opId });
        }

        // Fetch finished (success or error)
        if (fetchStatus === 'idle' && startTimes.has(queryHash)) {
            const { start, opId } = startTimes.get(queryHash)!;
            startTimes.delete(queryHash);
            
            const durationMs = Date.now() - start;
            const isError = status === 'error';
            
            if (isError) {
                logError('react-query', op, query.state.error, { 
                    opId, 
                    durationMs, 
                    startAt: new Date(start).toISOString(),
                    queryKey: JSON.stringify(query.queryKey)
                });
            } else {
                logEvent({
                    layer: 'react-query',
                    op,
                    opId,
                    startAt: new Date(start).toISOString(),
                    endAt: now(),
                    durationMs,
                    status: 'ok',
                    queryKey: JSON.stringify(query.queryKey),
                    // If duration is super short (<5ms) and no data change, might be a cache hit?
                    // React Query "fetchStatus" transitioning to idle usually means a fetch completed.
                });
            }
        }
    }
  });

  // --- Mutations ---
  mutationCache.subscribe((event: any) => {
      if (!event) return;
      
      // event.type: 'added', 'updated', 'removed'
      // mutation is in event.mutation
      
      const mutation = event.mutation;
      if (!mutation) return;
      
      const mutationId = mutation.mutationId;
      const op = getOp(mutation);
      
      if (event.type === 'added') {
          const opId = Math.random().toString(36).substring(2, 10);
          startTimes.set(String(mutationId), { start: Date.now(), opId });
      }
      
      if (event.type === 'updated') {
          const { status } = mutation.state;
          
          if ((status === 'success' || status === 'error') && startTimes.has(String(mutationId))) {
              const { start, opId } = startTimes.get(String(mutationId))!;
              startTimes.delete(String(mutationId));
              
              const durationMs = Date.now() - start;
              const isError = status === 'error';

              if (isError) {
                   logError('react-query', op, mutation.state.error, {
                       opId,
                       durationMs,
                       startAt: new Date(start).toISOString(),
                   });
              } else {
                  logEvent({
                      layer: 'react-query',
                      op,
                      opId,
                      startAt: new Date(start).toISOString(),
                      endAt: now(),
                      durationMs,
                      status: 'ok',
                  });
              }
          }
      }
  });
}

/**
 * Wraps an Expo SQLite database to provide structured logging with durations.
 * This captures actual execution time which Drizzle's built-in logger cannot do easily.
 */
export function createDrizzleLoggerMiddleware<T>(sqlite: T): T {
  const layer: LogLayer = "drizzle";

  const wrapStatement = (stmt: any, sql: string) => {
    // Attach SQL to the statement for later use in execution methods
    Object.defineProperty(stmt, "_sql", { value: sql, enumerable: false });

    const stmtAsyncMethods = ["executeAsync", "allAsync", "runAsync", "getAsync", "getFirstAsync", "eachAsync"];
    stmtAsyncMethods.forEach((m) => wrapAsyncMethod(stmt, m, "stmt", layer));

    const stmtSyncMethods = ["executeSync", "allSync", "runSync", "getSync", "getFirstSync", "eachSync"];
    stmtSyncMethods.forEach((m) => wrapSyncMethod(stmt, m, "stmt", layer));

    return stmt;
  };

  const wrapAsyncMethod = (target: any, methodName: string, opPrefix: string, layer: LogLayer) => {
    const original = target[methodName];
    if (typeof original !== "function") return;

    target[methodName] = async function (...args: any[]) {
      const startAt = now();
      const startTime = Date.now();
      const opId = Math.random().toString(36).substring(2, 10);
      const op = `db.${methodName}`;
      
      const sql = opPrefix === "stmt" ? target._sql : args[0];
      let params = opPrefix === "stmt" ? args[0] : args.slice(1);
      
      // Normalize params for top-level db methods: db.runAsync(sql, [p1, p2]) vs db.runAsync(sql, p1, p2)
      if (opPrefix === "db" && params.length === 1 && Array.isArray(params[0])) {
        params = params[0];
      }

      try {
        const result = await original.apply(this, args);
        const durationMs = Date.now() - startTime;
        logEvent({
          layer,
          op,
          opId,
          startAt,
          endAt: now(),
          durationMs,
          status: "ok",
          sql,
          params,
        });
        return result;
      } catch (error) {
        const durationMs = Date.now() - startTime;
        logError(layer, op, error, {
          opId,
          startAt,
          durationMs,
          sql,
          params,
        });
        throw error;
      }
    };
  };

  const wrapSyncMethod = (target: any, methodName: string, opPrefix: string, layer: LogLayer) => {
    const original = target[methodName];
    if (typeof original !== "function") return;

    target[methodName] = function (...args: any[]) {
      const startAt = now();
      const startTime = Date.now();
      const opId = Math.random().toString(36).substring(2, 10);
      const op = `db.${methodName}`;
      
      const sql = opPrefix === "stmt" ? target._sql : args[0];
      let params = opPrefix === "stmt" ? args[0] : args.slice(1);
      
      if (opPrefix === "db" && params.length === 1 && Array.isArray(params[0])) {
        params = params[0];
      }

      try {
        const result = original.apply(this, args);
        const durationMs = Date.now() - startTime;
        logEvent({
          layer,
          op,
          opId,
          startAt,
          endAt: now(),
          durationMs,
          status: "ok",
          sql,
          params,
        });
        return result;
      } catch (error) {
        const durationMs = Date.now() - startTime;
        logError(layer, op, error, {
          opId,
          startAt,
          durationMs,
          sql,
          params,
        });
        throw error;
      }
    };
  };

  // Wrap top-level sqlite methods
  const dbAsyncMethods = ["execAsync", "runAsync", "allAsync", "getFirstAsync", "eachAsync"];
  dbAsyncMethods.forEach((m) => wrapAsyncMethod(sqlite, m, "db", layer));

  const dbSyncMethods = ["execSync", "runSync", "allSync", "getFirstSync", "eachSync"];
  dbSyncMethods.forEach((m) => wrapSyncMethod(sqlite, m, "db", layer));

  // Wrap prepare methods to intercept statements
  const originalPrepareAsync = (sqlite as any).prepareAsync;
  if (originalPrepareAsync) {
    (sqlite as any).prepareAsync = async function (sql: string, ...rest: any[]) {
      const stmt = await originalPrepareAsync.apply(this, [sql, ...rest]);
      return wrapStatement(stmt, sql);
    };
  }

  const originalPrepareSync = (sqlite as any).prepareSync;
  if (originalPrepareSync) {
    (sqlite as any).prepareSync = function (sql: string, ...rest: any[]) {
      const stmt = originalPrepareSync.apply(this, [sql, ...rest]);
      return wrapStatement(stmt, sql);
    };
  }

  return sqlite;
}
