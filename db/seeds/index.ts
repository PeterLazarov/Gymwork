import { DataSource } from 'typeorm'

import ExerciseSeeder from './exerciseSeeder'
import WorkoutSeeder from './workoutSeeder'

export const runSeeds = async (database: DataSource) => {
  const exerciseSeeder = new ExerciseSeeder()
  const workoutSeeder = new WorkoutSeeder()

  // adds exercises
  await exerciseSeeder.run(database)

  // uses exercises, adds workoutSets and workouts
  await workoutSeeder.run(database)
}
