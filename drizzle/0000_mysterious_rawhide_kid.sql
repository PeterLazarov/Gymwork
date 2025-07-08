CREATE TABLE `discomfort_logs` (
	`workout_id` text NOT NULL,
	`set_id` text,
	`muscle_area_id` text NOT NULL,
	`severity` integer NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`workout_id`, `muscle_area_id`, `created_at`),
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`set_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`muscle_area_id`) REFERENCES `muscle_areas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_equipment` (
	`exercise_id` text NOT NULL,
	`equipment_id` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `equipment_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_metrics` (
	`metric_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `metric_id`),
	FOREIGN KEY (`metric_id`) REFERENCES `metrics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_muscle_areas` (
	`exercise_id` text NOT NULL,
	`muscle_area_id` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle_area_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`muscle_area_id`) REFERENCES `muscle_areas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_muscles` (
	`exercise_id` text NOT NULL,
	`muscle_id` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	`tips` text,
	`instructions` text,
	`images` text,
	`record_config_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`record_config_id`) REFERENCES `record_calculation_configs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_tags` (
	`tag_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`unit` text NOT NULL,
	`round_to` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `muscle_areas` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `muscles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `record_calculation_configs` (
	`id` integer PRIMARY KEY NOT NULL,
	`measurement_column` text,
	`measurement_sort_direction` text DEFAULT 'desc' NOT NULL,
	`grouping_column` text,
	`grouping_sort_direction` text DEFAULT 'desc' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `set_group_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `set_group_template_tags` (
	`tag_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `set_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`template_id` text,
	`name` text,
	`type` text NOT NULL,
	`position` integer NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `set_group_tags` (
	`tag_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `set_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `set_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`set_group_id` text NOT NULL,
	`exercise_id` text NOT NULL,
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
	FOREIGN KEY (`set_group_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `set_template_tags` (
	`tag_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `set_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`set_group_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`template_id` text,
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
	FOREIGN KEY (`set_group_id`) REFERENCES `set_groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `set_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `set_tags` (
	`tag_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`color` text,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_templates_set_group_templates` (
	`workout_template_id` text NOT NULL,
	`set_group_template_id` text NOT NULL,
	PRIMARY KEY(`workout_template_id`, `set_group_template_id`),
	FOREIGN KEY (`workout_template_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`set_group_template_id`) REFERENCES `set_group_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_template_tags` (
	`tag_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`name` text,
	`notes` text,
	`scheduled_for` integer,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_tags` (
	`tag_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	PRIMARY KEY(`tag_id`, `entity_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action
);
