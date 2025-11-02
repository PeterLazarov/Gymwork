ALTER TABLE `settings` RENAME TO `settings_old`;
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`theme` text DEFAULT 'light',
	`scientific_muscle_names_enabled` integer DEFAULT false NOT NULL,
	`show_set_completion` integer DEFAULT false NOT NULL,
	`preview_next_set` integer DEFAULT false NOT NULL,
	`measure_rest` integer DEFAULT false NOT NULL,
	`show_comments_card` integer DEFAULT false NOT NULL,
	`show_workout_timer` integer DEFAULT false NOT NULL,
	`feedback_user` text DEFAULT '',
	`created_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `settings` (
	`id`,
	`theme`,
	`scientific_muscle_names_enabled`,
	`show_set_completion`,
	`preview_next_set`,
	`measure_rest`,
	`show_comments_card`,
	`show_workout_timer`,
	`feedback_user`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	`theme`,
	`scientific_muscle_names_enabled`,
	`show_set_completion`,
	`preview_next_set`,
	`measure_rest`,
	`show_comments_card`,
	`show_workout_timer`,
	'' AS `feedback_user`,
	`created_at`,
	`updated_at`
FROM `settings_old`;
--> statement-breakpoint
DROP TABLE `settings_old`;

