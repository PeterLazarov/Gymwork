import { DataSource, Repository } from 'typeorm'

import { WorkoutExercise } from '../models'

export class WorkoutExerciseRepository {
  private ormRepository: Repository<WorkoutExercise>

  constructor(datasource: DataSource) {
    this.ormRepository = datasource.getRepository(WorkoutExercise)
  }

  public async getAll(): Promise<WorkoutExercise[]> {
    return await this.ormRepository.find()
  }

  public async create(
    data: Partial<WorkoutExercise>
  ): Promise<WorkoutExercise> {
    const record = this.ormRepository.create(data)

    await this.ormRepository.save(record)

    return record
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async update(
    id: number,
    data: Partial<WorkoutExercise>
  ): Promise<void> {
    await this.ormRepository.update(id, data)
  }
}
