export function getBestSetsForExercise(exerciseId: string) {
  const q = `
    WITH metrics AS (
      SELECT
        s.id               AS set_id,
        s.exercise_id,
        s.reps,
        s.weight_mcg,
        s.distance_mm,
        s.duration_ms,
        CASE rc.grouping_column
          WHEN 'reps'        THEN s.reps
          WHEN 'weight_mcg'  THEN s.weight_mcg
          WHEN 'distance_mm' THEN s.distance_mm
          WHEN 'duration_ms' THEN s.duration_ms
        END                AS grouping_value,
        CASE rc.measurement_column
          WHEN 'reps'        THEN s.reps
          WHEN 'weight_mcg'  THEN s.weight_mcg
          WHEN 'distance_mm' THEN s.distance_mm
          WHEN 'duration_ms' THEN s.duration_ms
        END                AS measurement_value,
        rc.grouping_sort_direction,
        rc.measurement_sort_direction,
        s.completed_at
      FROM sets s
      JOIN exercises e  ON e.id = s.exercise_id
      JOIN record_calculation_configs rc
        ON rc.id = e.record_config_id
      WHERE s.exercise_id = '${exerciseId}'
    ),
    ranked AS (
      SELECT
        *,
        ROW_NUMBER() OVER (
          PARTITION BY grouping_value
          ORDER BY
            CASE WHEN measurement_sort_direction = 'asc'  THEN measurement_value END ASC,
            CASE WHEN measurement_sort_direction = 'desc' THEN measurement_value END DESC,
            completed_at ASC
        ) AS rn
      FROM metrics
    )
    SELECT
      set_id,
      exercise_id,
      reps,
      weight_mcg,
      distance_mm,
      duration_ms
    FROM ranked
    WHERE rn = 1
    ORDER BY grouping_value
      * (CASE WHEN grouping_sort_direction = 'asc' THEN 1 ELSE -1 END)
  `
  return q
}
