CREATE INDEX `sets_workout_step_id_idx` ON `sets` (`workout_step_id`);--> statement-breakpoint
CREATE INDEX `sets_exercise_id_idx` ON `sets` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `sets_date_idx` ON `sets` (`date`);--> statement-breakpoint
CREATE INDEX `workout_step_exercises_workout_step_id_idx` ON `workout_step_exercises` (`workout_step_id`);--> statement-breakpoint
CREATE INDEX `workout_steps_workout_id_idx` ON `workout_steps` (`workout_id`);--> statement-breakpoint
CREATE INDEX `workouts_date_idx` ON `workouts` (`date`);