CREATE TABLE `exercise_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_id` integer NOT NULL,
	`measurement_type` text NOT NULL,
	`unit` text NOT NULL,
	`more_is_better` integer DEFAULT true NOT NULL,
	`step_value` real,
	`min_value` real,
	`max_value` real,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`images` text DEFAULT '[]',
	`equipment` text DEFAULT '[]',
	`muscle_areas` text DEFAULT '[]',
	`muscles` text DEFAULT '[]',
	`instructions` text DEFAULT '[]',
	`tips` text,
	`position` text,
	`stance` text,
	`is_favorite` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_step_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`is_warmup` integer DEFAULT false NOT NULL,
	`date` integer NOT NULL,
	`is_weak_ass_record` integer DEFAULT false NOT NULL,
	`reps` integer,
	`weight_mcg` integer,
	`distance_mm` integer,
	`duration_ms` integer,
	`speed_kph` real,
	`rest_ms` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`workout_step_id`) REFERENCES `workout_steps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `set_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`theme` text DEFAULT 'light' NOT NULL,
	`scientific_muscle_names_enabled` integer DEFAULT false NOT NULL,
	`show_set_completion` integer DEFAULT true NOT NULL,
	`preview_next_set` integer DEFAULT true NOT NULL,
	`measure_rest` integer DEFAULT true NOT NULL,
	`show_comments_card` integer DEFAULT true NOT NULL,
	`show_workout_timer` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`color` text,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_step_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_step_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`workout_step_id`) REFERENCES `workout_steps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`step_type` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout_step_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `workout_steps`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`notes` text,
	`date` integer,
	`feeling` text,
	`pain` text,
	`rpe` integer,
	`ended_at` integer,
	`duration_ms` integer,
	`is_template` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_tags` (
	`tag_id` integer NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
