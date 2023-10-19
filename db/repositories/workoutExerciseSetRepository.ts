import { DataSource, Repository } from 'typeorm'

import { WorkoutExerciseSet } from '../models'

export class WorkoutExerciseSetRepository {
  private ormRepository: Repository<WorkoutExerciseSet>

  constructor(datasource: DataSource) {
    this.ormRepository = datasource.getRepository(WorkoutExerciseSet)
  }

  public async getAll(): Promise<WorkoutExerciseSet[]> {
    return await this.ormRepository.find()
  }

  public async create(
    data: Partial<WorkoutExerciseSet>
  ): Promise<WorkoutExerciseSet> {
    const record = this.ormRepository.create(data)

    await this.ormRepository.save(record)

    return record
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async update(
    id: number,
    data: Partial<WorkoutExerciseSet>
  ): Promise<void> {
    await this.ormRepository.update(id, data)
  }
}
