import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column()
  category: string

  @Column()
  type: string
}
