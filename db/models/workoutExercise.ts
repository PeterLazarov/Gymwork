import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Exercise } from './exercise'
import { Workout } from './workout'
import { WorkoutExerciseSet } from './workoutExerciseSet'

@Entity('workout_exercises')
export class WorkoutExercise {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  notes?: string

  @ManyToOne(() => Exercise)
  exercise: Exercise

  @ManyToOne(() => Workout)
  workout: Workout

  // @OneToMany(
  //   () => WorkoutExerciseSet,
  //   workoutExerciseSet => workoutExerciseSet.workoutExercise
  // )
  // sets: WorkoutExerciseSet[]

  name: string

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateVirtualFields(): void {
    this.name = this.exercise?.name
  }
}
