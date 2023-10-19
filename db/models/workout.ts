import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { WorkoutExercise } from './workoutExercise'

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  date: string

  @Column()
  notes?: string

  @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.workout)
  exercises: WorkoutExercise[]
}
