import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  date: string

  @Column()
  notes: string
}
