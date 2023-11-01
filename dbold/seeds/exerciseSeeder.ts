import { DataSource } from 'typeorm'

import exerciseSeedData from './exercises-seed-data.json'
import { Exercise } from '../models'

export default class ExerciseSeeder {
  public async run(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Exercise)
      .values(exerciseSeedData)
      .execute()

    console.log('Exercises seeded')
  }
}
