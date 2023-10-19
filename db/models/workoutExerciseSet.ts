import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { WorkoutExercise } from './workoutExercise'

@Entity('workout_exercise_sets')
export class WorkoutExerciseSet {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  weight?: number

  @Column()
  reps?: number

  @Column()
  time?: number

  @ManyToOne(() => WorkoutExercise)
  workoutExercise: WorkoutExercise
}
