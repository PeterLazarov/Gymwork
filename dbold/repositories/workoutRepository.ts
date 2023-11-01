import {
  DataSource,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm'

import { Workout } from '../models'

type Filter = Partial<Pick<Workout, 'date'>>

type GetAllOptions = {
  filter?: FindOptionsWhere<Workout>
  relations?: FindOptionsRelations<Workout>
}

export class WorkoutRepository {
  private ormRepository: Repository<Workout>

  constructor(datasource: DataSource) {
    this.ormRepository = datasource.getRepository(Workout)
  }

  public async getAll(options: GetAllOptions): Promise<Workout[]> {
    return await this.ormRepository.find({
      where: options.filter,
      relations: options.relations,
    })
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
