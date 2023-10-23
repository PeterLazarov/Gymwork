import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import type { Exercise } from './exercise'
import type { Workout } from './workout'
import type { WorkoutExerciseSet } from './workoutExerciseSet'

// Don't think we really need this Entity.
@Entity('workout_exercises')
export class WorkoutExercise {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ default: '' })
  notes: string

  @ManyToMany('exercises')
  @JoinTable()
  exercise: Exercise

  @ManyToOne('workouts', (w: Workout) => w.exercises)
  workout: Workout

  @OneToMany(
    'workout_exercise_sets',
    ({ workoutExercise }: WorkoutExerciseSet) => workoutExercise,
    {
      orphanedRowAction: 'delete',
    }
  )
  sets: WorkoutExerciseSet[]

  name: string

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateVirtualFields(): void {
    this.name = this.exercise?.name
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    if (!this.sets) {
      this.sets = []
    }
  }
}
