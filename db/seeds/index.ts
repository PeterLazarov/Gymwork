import { DataSource } from 'typeorm'

import ExerciseSeeder from './exerciseSeeder'

export const runSeeds = (database: DataSource) => {
  const exerciseSeeder = new ExerciseSeeder()

  exerciseSeeder.run(database)
}
