import { SQLiteDatabase } from "expo-sqlite"

/**
 * Creates all database tables if they don't exist
 * This should be run before any database queries
 */
export function createTables(sqlite: SQLiteDatabase) {
  console.log("Creating database tables...")

  try {
    // Create settings table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        theme TEXT NOT NULL DEFAULT 'light' CHECK(theme IN ('light', 'dark')),
        scientific_muscle_names_enabled INTEGER NOT NULL DEFAULT 0,
        show_set_completion INTEGER NOT NULL DEFAULT 1,
        preview_next_set INTEGER NOT NULL DEFAULT 1,
        measure_rest INTEGER NOT NULL DEFAULT 1,
        show_comments_card INTEGER NOT NULL DEFAULT 1,
        show_workout_timer INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer))
      );
    `)

    // Create exercises table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        images TEXT DEFAULT '[]',
        equipment TEXT DEFAULT '[]',
        muscle_areas TEXT DEFAULT '[]',
        muscles TEXT DEFAULT '[]',
        instructions TEXT DEFAULT '[]',
        tips TEXT,
        position TEXT,
        stance TEXT,
        is_favorite INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer))
      );
    `)

    // Create exercise_measurements table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS exercise_measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        measurement_type TEXT NOT NULL CHECK(measurement_type IN ('weight', 'duration', 'reps', 'distance', 'speed', 'rest')),
        unit TEXT NOT NULL,
        more_is_better INTEGER NOT NULL DEFAULT 1,
        step_value REAL,
        min_value REAL,
        max_value REAL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      );
    `)

    // Create workouts table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        notes TEXT,
        date INTEGER,
        feeling TEXT,
        pain TEXT,
        rpe INTEGER,
        ended_at INTEGER,
        duration_ms INTEGER,
        is_template INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer))
      );
    `)

    // Create workout_steps table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS workout_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        step_type TEXT NOT NULL CHECK(step_type IN ('plain', 'superset', 'circuit', 'emom', 'amrap', 'custom')),
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
      );
    `)

    // Create workout_step_exercises table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS workout_step_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_step_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        FOREIGN KEY (workout_step_id) REFERENCES workout_steps(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      );
    `)

    // Create workout_sets table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS workout_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_step_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        is_warmup INTEGER NOT NULL DEFAULT 0,
        date INTEGER NOT NULL,
        is_weak_ass_record INTEGER NOT NULL DEFAULT 0,
        reps INTEGER,
        weight_mcg INTEGER,
        distance_mm INTEGER,
        duration_ms INTEGER,
        speed_kph REAL,
        rest_ms INTEGER,
        completed_at INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        FOREIGN KEY (workout_step_id) REFERENCES workout_steps(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      );
    `)

    // Create tags table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        color TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer))
      );
    `)

    // Create workout_tags table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS workout_tags (
        tag_id INTEGER NOT NULL,
        entity_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        PRIMARY KEY (tag_id, entity_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        FOREIGN KEY (entity_id) REFERENCES workouts(id) ON DELETE CASCADE
      );
    `)

    // Create workout_step_tags table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS workout_step_tags (
        tag_id INTEGER NOT NULL,
        entity_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        PRIMARY KEY (tag_id, entity_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        FOREIGN KEY (entity_id) REFERENCES workout_steps(id) ON DELETE CASCADE
      );
    `)

    // Create workout_set_tags table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS workout_set_tags (
        tag_id INTEGER NOT NULL,
        entity_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        PRIMARY KEY (tag_id, entity_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        FOREIGN KEY (entity_id) REFERENCES workout_sets(id) ON DELETE CASCADE
      );
    `)

    // Create exercise_tags table
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS exercise_tags (
        tag_id INTEGER NOT NULL,
        entity_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)),
        PRIMARY KEY (tag_id, entity_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        FOREIGN KEY (entity_id) REFERENCES exercises(id) ON DELETE CASCADE
      );
    `)

    console.log("Database tables created successfully!")
  } catch (error) {
    console.error("Error creating database tables:", error)
    throw error
  }
}
