DROP VIEW `exercise_records`;--> statement-breakpoint
CREATE VIEW `exercise_records` AS
  WITH exercise_measurement_types AS (
    SELECT
      exercise_metrics.exercise_id,
      group_concat(exercise_metrics.measurement_type) AS measurement_types
    FROM exercise_metrics
    GROUP BY exercise_metrics.exercise_id
  ),
  measurement_sets AS (
    SELECT
      ws.id,
      ws.exercise_id,
      ws.reps,
      ws.weight_mcg,
      ws.distance_mm,
      ws.duration_ms,
      ws.speed_kph,
      ws.date,
      emt.measurement_types,
      CASE
        WHEN emt.measurement_types = 'weight' THEN 0
        WHEN emt.measurement_types = 'duration' THEN 0
        WHEN emt.measurement_types = 'reps' THEN 0
        WHEN emt.measurement_types = 'distance' THEN 0
        WHEN emt.measurement_types IN ('weight,duration','duration,weight') THEN ws.weight_mcg
        WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ws.reps
        WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ws.duration_ms
        WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ws.weight_mcg
        WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN ws.distance_mm
        WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ws.reps
        ELSE NULL
      END AS grouping_value,
      CASE
        WHEN emt.measurement_types = 'weight' THEN ws.weight_mcg
        WHEN emt.measurement_types = 'duration' THEN ws.duration_ms
        WHEN emt.measurement_types = 'reps' THEN ws.reps
        WHEN emt.measurement_types = 'distance' THEN ws.distance_mm
        WHEN emt.measurement_types IN ('weight,duration','duration,weight') THEN ws.duration_ms
        WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ws.weight_mcg
        WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ws.reps
        WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ws.distance_mm
        WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN ws.duration_ms
        WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ws.distance_mm
        ELSE NULL
      END AS measurement_value,
      CASE
        WHEN emt.measurement_types = 'weight' THEN 'weight'
        WHEN emt.measurement_types = 'duration' THEN 'duration'
        WHEN emt.measurement_types = 'reps' THEN 'reps'
        WHEN emt.measurement_types = 'distance' THEN 'distance'
        WHEN emt.measurement_types IN ('weight,duration','duration,weight') THEN 'duration'
        WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN 'weight'
        WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN 'reps'
        WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN 'distance'
        WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN 'duration'
        WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN 'distance'
        ELSE NULL
      END AS measuring_metric_type
    FROM sets ws
    JOIN exercise_measurement_types emt ON ws.exercise_id = emt.exercise_id
    WHERE ws.is_warmup = 0
  ),
  ranked_sets AS (
    SELECT
      ms.id,
      ms.exercise_id,
      ms.reps,
      ms.weight_mcg,
      ms.distance_mm,
      ms.duration_ms,
      ms.speed_kph,
      ms.date,
      ms.measurement_types,
      ms.grouping_value,
      ms.measurement_value,
      ms.measuring_metric_type,
      em.more_is_better,
      row_number() OVER (
        PARTITION BY ms.exercise_id, ms.grouping_value
        ORDER BY
          CASE
            WHEN em.more_is_better THEN ms.measurement_value
            ELSE -ms.measurement_value
          END DESC,
          ms.date DESC
      ) AS rank
    FROM measurement_sets ms
    LEFT JOIN exercise_metrics em
      ON ms.exercise_id = em.exercise_id
      AND ms.measuring_metric_type = em.measurement_type
  ),
  records AS (
    SELECT * FROM ranked_sets WHERE rank = 1
  )
  SELECT
    r1.id AS record_id,
    r1.exercise_id,
    r1.reps,
    r1.weight_mcg,
    r1.distance_mm,
    r1.duration_ms,
    r1.speed_kph,
    r1.date,
    r1.grouping_value,
    r1.measurement_value,
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM records r2
        WHERE r2.exercise_id = r1.exercise_id
          AND r2.grouping_value >= r1.grouping_value
          AND (
            (r1.more_is_better = 1 AND r2.measurement_value >= r1.measurement_value) OR
            (r1.more_is_better = 0 AND r2.measurement_value <= r1.measurement_value)
          )
          AND (
            r2.grouping_value > r1.grouping_value OR
            (r1.more_is_better = 1 AND r2.measurement_value > r1.measurement_value) OR
            (r1.more_is_better = 0 AND r2.measurement_value < r1.measurement_value)
          )
      ) THEN 1
      ELSE 0
    END AS is_weak_ass
  FROM records r1
  ORDER BY r1.exercise_id, r1.grouping_value;
