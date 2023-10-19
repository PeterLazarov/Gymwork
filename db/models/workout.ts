import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Exercise } from './exercise'

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  date: string

  @Column()
  notes?: string

  @ManyToMany(() => Exercise)
  @JoinTable()
  exercises: Exercise[]
}
