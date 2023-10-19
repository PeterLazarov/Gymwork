import { DataSource, Repository } from 'typeorm'

import { Exercise } from '../models'

type GetAllOptions = {
  filter?: Partial<Exercise>
}

export class ExerciseRepository {
  private ormRepository: Repository<Exercise>

  constructor(datasource: DataSource) {
    this.ormRepository = datasource.getRepository(Exercise)
  }

  public async getAll(options: GetAllOptions): Promise<Exercise[]> {
    return await this.ormRepository.find({
      where: options.filter,
    })
  }

  public async create(data: Partial<Exercise>): Promise<Exercise> {
    const record = this.ormRepository.create(data)

    await this.ormRepository.save(record)

    return record
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }

  public async update(id: number, data: Partial<Exercise>): Promise<void> {
    await this.ormRepository.update(id, data)
  }
}
