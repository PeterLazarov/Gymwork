CREATE INDEX IF NOT EXISTS `sets_workout_step_id_idx` ON `sets` (`workout_step_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `sets_exercise_id_idx` ON `sets` (`exercise_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `sets_date_idx` ON `sets` (`date`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workout_step_exercises_workout_step_id_idx` ON `workout_step_exercises` (`workout_step_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workout_steps_workout_id_idx` ON `workout_steps` (`workout_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workouts_date_idx` ON `workouts` (`date`);