import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { WorkoutExercise } from './_workoutExercise'

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  date: string

  @Column({ default: '' })
  notes: string

  @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.workout)
  exercises: WorkoutExercise[]

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  nullChecks(): void {
    if (!this.exercises) {
      this.exercises = []
    }
  }
}
