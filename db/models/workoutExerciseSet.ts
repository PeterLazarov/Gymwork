import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import type { WorkoutExercise } from './workoutExercise'

@Entity('workout_exercise_sets')
export class WorkoutExerciseSet {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ nullable: true })
  weight?: number

  @Column({ nullable: true })
  reps?: number

  @Column({ nullable: true })
  time?: number

  @ManyToOne('workout_exercises', ({ sets }: WorkoutExercise) => sets)
  workoutExercise: WorkoutExercise
}
