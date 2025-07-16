PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_discomfort_logs` (
	`workout_id` integer,
	`set_id` integer,
	`muscle_area_id` integer,
	`severity` integer NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`workout_id`, `muscle_area_id`, `created_at`),
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`set_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`muscle_area_id`) REFERENCES `muscle_areas`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_discomfort_logs`("workout_id", "set_id", "muscle_area_id", "severity", "notes", "created_at") SELECT "workout_id", "set_id", "muscle_area_id", "severity", "notes", "created_at" FROM `discomfort_logs`;--> statement-breakpoint
DROP TABLE `discomfort_logs`;--> statement-breakpoint
ALTER TABLE `__new_discomfort_logs` RENAME TO `discomfort_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_equipment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_equipment`("id", "name") SELECT "id", "name" FROM `equipment`;--> statement-breakpoint
DROP TABLE `equipment`;--> statement-breakpoint
ALTER TABLE `__new_equipment` RENAME TO `equipment`;--> statement-breakpoint
CREATE TABLE `__new_exercise_equipment` (
	`exercise_id` integer NOT NULL,
	`equipment_id` integer NOT NULL,
	PRIMARY KEY(`exercise_id`, `equipment_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercise_equipment`("exercise_id", "equipment_id") SELECT "exercise_id", "equipment_id" FROM `exercise_equipment`;--> statement-breakpoint
DROP TABLE `exercise_equipment`;--> statement-breakpoint
ALTER TABLE `__new_exercise_equipment` RENAME TO `exercise_equipment`;--> statement-breakpoint
CREATE TABLE `__new_exercise_metrics` (
	`metric_id` text NOT NULL,
	`exercise_id` integer NOT NULL,
	PRIMARY KEY(`exercise_id`, `metric_id`),
	FOREIGN KEY (`metric_id`) REFERENCES `metrics`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercise_metrics`("metric_id", "exercise_id") SELECT "metric_id", "exercise_id" FROM `exercise_metrics`;--> statement-breakpoint
DROP TABLE `exercise_metrics`;--> statement-breakpoint
ALTER TABLE `__new_exercise_metrics` RENAME TO `exercise_metrics`;--> statement-breakpoint
CREATE TABLE `__new_exercise_muscle_areas` (
	`exercise_id` integer NOT NULL,
	`muscle_area_id` integer NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle_area_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`muscle_area_id`) REFERENCES `muscle_areas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercise_muscle_areas`("exercise_id", "muscle_area_id") SELECT "exercise_id", "muscle_area_id" FROM `exercise_muscle_areas`;--> statement-breakpoint
DROP TABLE `exercise_muscle_areas`;--> statement-breakpoint
ALTER TABLE `__new_exercise_muscle_areas` RENAME TO `exercise_muscle_areas`;--> statement-breakpoint
CREATE TABLE `__new_exercise_muscles` (
	`exercise_id` integer NOT NULL,
	`muscle_id` integer NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercise_muscles`("exercise_id", "muscle_id") SELECT "exercise_id", "muscle_id" FROM `exercise_muscles`;--> statement-breakpoint
DROP TABLE `exercise_muscles`;--> statement-breakpoint
ALTER TABLE `__new_exercise_muscles` RENAME TO `exercise_muscles`;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	`tips` text,
	`instructions` text,
	`images` text,
	`record_config_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`record_config_id`) REFERENCES `record_calculation_configs`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "name", "is_favorite", "tips", "instructions", "images", "record_config_id", "created_at") SELECT "id", "name", "is_favorite", "tips", "instructions", "images", "record_config_id", "created_at" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
CREATE TABLE `__new_exercise_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercise_tags`("tag_id", "entity_id", "created_at") SELECT "tag_id", "entity_id", "created_at" FROM `exercise_tags`;--> statement-breakpoint
DROP TABLE `exercise_tags`;--> statement-breakpoint
ALTER TABLE `__new_exercise_tags` RENAME TO `exercise_tags`;--> statement-breakpoint
CREATE TABLE `__new_muscle_areas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_muscle_areas`("id", "name") SELECT "id", "name" FROM `muscle_areas`;--> statement-breakpoint
DROP TABLE `muscle_areas`;--> statement-breakpoint
ALTER TABLE `__new_muscle_areas` RENAME TO `muscle_areas`;--> statement-breakpoint
CREATE TABLE `__new_muscles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_muscles`("id", "name") SELECT "id", "name" FROM `muscles`;--> statement-breakpoint
DROP TABLE `muscles`;--> statement-breakpoint
ALTER TABLE `__new_muscles` RENAME TO `muscles`;--> statement-breakpoint
CREATE TABLE `__new_record_calculation_configs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`measurement_column` text,
	`measurement_sort_direction` text DEFAULT 'desc' NOT NULL,
	`grouping_column` text,
	`grouping_sort_direction` text DEFAULT 'desc' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_record_calculation_configs`("id", "measurement_column", "measurement_sort_direction", "grouping_column", "grouping_sort_direction") SELECT "id", "measurement_column", "measurement_sort_direction", "grouping_column", "grouping_sort_direction" FROM `record_calculation_configs`;--> statement-breakpoint
DROP TABLE `record_calculation_configs`;--> statement-breakpoint
ALTER TABLE `__new_record_calculation_configs` RENAME TO `record_calculation_configs`;--> statement-breakpoint
CREATE TABLE `__new_set_group_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_set_group_templates`("id", "name", "type", "position", "created_at") SELECT "id", "name", "type", "position", "created_at" FROM `set_group_templates`;--> statement-breakpoint
DROP TABLE `set_group_templates`;--> statement-breakpoint
ALTER TABLE `__new_set_group_templates` RENAME TO `set_group_templates`;--> statement-breakpoint
CREATE TABLE `__new_set_group_template_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_set_group_template_tags`("tag_id", "entity_id", "created_at") SELECT "tag_id", "entity_id", "created_at" FROM `set_group_template_tags`;--> statement-breakpoint
DROP TABLE `set_group_template_tags`;--> statement-breakpoint
ALTER TABLE `__new_set_group_template_tags` RENAME TO `set_group_template_tags`;--> statement-breakpoint
CREATE TABLE `__new_set_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`template_id` integer,
	`name` text,
	`type` text NOT NULL,
	`position` integer NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`template_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_set_groups`("id", "workout_id", "template_id", "name", "type", "position", "started_at", "completed_at", "created_at") SELECT "id", "workout_id", "template_id", "name", "type", "position", "started_at", "completed_at", "created_at" FROM `set_groups`;--> statement-breakpoint
DROP TABLE `set_groups`;--> statement-breakpoint
ALTER TABLE `__new_set_groups` RENAME TO `set_groups`;--> statement-breakpoint
CREATE TABLE `__new_set_group_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `set_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_set_group_tags`("tag_id", "entity_id", "created_at") SELECT "tag_id", "entity_id", "created_at" FROM `set_group_tags`;--> statement-breakpoint
DROP TABLE `set_group_tags`;--> statement-breakpoint
ALTER TABLE `__new_set_group_tags` RENAME TO `set_group_tags`;--> statement-breakpoint
CREATE TABLE `__new_set_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`set_group_template_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`name` text,
	`position` integer NOT NULL,
	`is_warmup` integer DEFAULT false NOT NULL,
	`reps` integer,
	`weight_mcg` integer,
	`distance_mm` integer,
	`duration_ms` integer,
	`rest_ms` integer,
	`rpe` integer,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`set_group_template_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_set_templates`("id", "set_group_template_id", "exercise_id", "name", "position", "is_warmup", "reps", "weight_mcg", "distance_mm", "duration_ms", "rest_ms", "rpe", "created_at") SELECT "id", "set_group_template_id", "exercise_id", "name", "position", "is_warmup", "reps", "weight_mcg", "distance_mm", "duration_ms", "rest_ms", "rpe", "created_at" FROM `set_templates`;--> statement-breakpoint
DROP TABLE `set_templates`;--> statement-breakpoint
ALTER TABLE `__new_set_templates` RENAME TO `set_templates`;--> statement-breakpoint
CREATE TABLE `__new_set_template_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `set_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_set_template_tags`("tag_id", "entity_id", "created_at") SELECT "tag_id", "entity_id", "created_at" FROM `set_template_tags`;--> statement-breakpoint
DROP TABLE `set_template_tags`;--> statement-breakpoint
ALTER TABLE `__new_set_template_tags` RENAME TO `set_template_tags`;--> statement-breakpoint
CREATE TABLE `__new_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`set_group_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`template_id` integer,
	`position` integer NOT NULL,
	`is_warmup` integer DEFAULT false NOT NULL,
	`reps` integer,
	`weight_mcg` integer,
	`distance_mm` integer,
	`duration_ms` integer,
	`rest_ms` integer,
	`rpe` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`set_group_id`) REFERENCES `set_groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `set_templates`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_sets`("id", "set_group_id", "exercise_id", "template_id", "position", "is_warmup", "reps", "weight_mcg", "distance_mm", "duration_ms", "rest_ms", "rpe", "completed_at", "created_at") SELECT "id", "set_group_id", "exercise_id", "template_id", "position", "is_warmup", "reps", "weight_mcg", "distance_mm", "duration_ms", "rest_ms", "rpe", "completed_at", "created_at" FROM `sets`;--> statement-breakpoint
DROP TABLE `sets`;--> statement-breakpoint
ALTER TABLE `__new_sets` RENAME TO `sets`;--> statement-breakpoint
CREATE TABLE `__new_set_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_set_tags`("tag_id", "entity_id", "created_at") SELECT "tag_id", "entity_id", "created_at" FROM `set_tags`;--> statement-breakpoint
DROP TABLE `set_tags`;--> statement-breakpoint
ALTER TABLE `__new_set_tags` RENAME TO `set_tags`;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`color` text,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "name", "category", "color", "created_at") SELECT "id", "name", "category", "color", "created_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
CREATE TABLE `__new_workout_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_workout_templates`("id", "name", "notes", "created_at") SELECT "id", "name", "notes", "created_at" FROM `workout_templates`;--> statement-breakpoint
DROP TABLE `workout_templates`;--> statement-breakpoint
ALTER TABLE `__new_workout_templates` RENAME TO `workout_templates`;--> statement-breakpoint
CREATE TABLE `__new_workout_template_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workout_template_tags`("tag_id", "entity_id", "created_at") SELECT "tag_id", "entity_id", "created_at" FROM `workout_template_tags`;--> statement-breakpoint
DROP TABLE `workout_template_tags`;--> statement-breakpoint
ALTER TABLE `__new_workout_template_tags` RENAME TO `workout_template_tags`;--> statement-breakpoint
CREATE TABLE `__new_workout_templates_to_set_group_templates` (
	`workout_template_id` integer NOT NULL,
	`set_group_template_id` integer NOT NULL,
	PRIMARY KEY(`workout_template_id`, `set_group_template_id`),
	FOREIGN KEY (`workout_template_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`set_group_template_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workout_templates_to_set_group_templates`("workout_template_id", "set_group_template_id") SELECT "workout_template_id", "set_group_template_id" FROM `workout_templates_to_set_group_templates`;--> statement-breakpoint
DROP TABLE `workout_templates_to_set_group_templates`;--> statement-breakpoint
ALTER TABLE `__new_workout_templates_to_set_group_templates` RENAME TO `workout_templates_to_set_group_templates`;--> statement-breakpoint
CREATE TABLE `__new_workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_id` integer,
	`name` text,
	`notes` text,
	`scheduled_for` integer,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_workouts`("id", "template_id", "name", "notes", "scheduled_for", "started_at", "completed_at", "created_at") SELECT "id", "template_id", "name", "notes", "scheduled_for", "started_at", "completed_at", "created_at" FROM `workouts`;--> statement-breakpoint
DROP TABLE `workouts`;--> statement-breakpoint
ALTER TABLE `__new_workouts` RENAME TO `workouts`;--> statement-breakpoint
CREATE TABLE `__new_workout_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workout_tags`("tag_id", "entity_id", "created_at") SELECT "tag_id", "entity_id", "created_at" FROM `workout_tags`;--> statement-breakpoint
DROP TABLE `workout_tags`;--> statement-breakpoint
ALTER TABLE `__new_workout_tags` RENAME TO `workout_tags`;