import { Connection, Repository } from 'typeorm'

import { Workout } from '../models/workout'

export class WorkoutRepository {
  private ormRepository: Repository<Workout>

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(Workout)
  }

  public async getAll(): Promise<Workout[]> {
    return await this.ormRepository.find()
  }

  public async create(data: Partial<Workout>): Promise<Workout> {
    const record = this.ormRepository.create(data)

    await this.ormRepository.save(record)

    return record
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async update(id: number, data: Partial<Workout>): Promise<void> {
    await this.ormRepository.update(id, data)
  }
}
