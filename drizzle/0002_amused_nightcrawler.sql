ALTER TABLE `settings` RENAME COLUMN "show_set_completion" TO "manual_set_completion";--> statement-breakpoint
ALTER TABLE `settings` ADD `visited_welcome_screen` integer DEFAULT false NOT NULL;