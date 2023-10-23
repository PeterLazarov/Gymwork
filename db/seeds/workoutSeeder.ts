import { DateTime } from 'luxon'
import { DataSource } from 'typeorm'
import {
  Exercise,
  Workout,
  WorkoutExercise,
  WorkoutExerciseSet,
} from '../models'

export default class WorkoutSeeder {
  public async run(db: DataSource): Promise<void> {
    const numberOfWorkouts = 100
    const today = DateTime.fromISO(DateTime.now().toISODate()!)

    const workoutRepo = db.getRepository(Workout)
    const workoutExerciseRepo = db.getRepository(WorkoutExercise)
    const workoutExerciseSetRepo = db.getRepository(WorkoutExerciseSet)
    const exerciseRepo = db.getRepository(Exercise)

    const bp = await exerciseRepo.findOne({
      where: { name: 'Barbell Bench Press - Medium Grip' },
    })

    if (!bp) {
      throw new Error('Bench Press not found')
    }

    for (let i = 0; i < numberOfWorkouts; i++) {
      const workoutObj = {
        date: today
          .minus({ days: i * Math.ceil(Math.random() * 3) })
          // .minus({ days: i + 1 })
          .toISODate()!,
      }
      const workout = workoutRepo.create(workoutObj)
      const workoutSaved = await workoutRepo.save(workout)

      const workoutExerciseObject: Partial<WorkoutExercise> = {
        exercise: bp,
        workout: workoutSaved,
        notes: 'noteworthy',
      }
      const workoutExercise = workoutExerciseRepo.create(workoutExerciseObject)
      const workoutExerciseSaved =
        await workoutExerciseRepo.save(workoutExercise)

      await db
        .createQueryBuilder()
        .relation(WorkoutExercise, 'workout')
        .of(workoutExerciseSaved)
        .set(workoutSaved)

      const workoutExerciseSetObjects = Array.from({
        length: Math.ceil(Math.random() * 5),
      })
        .map(
          (): Partial<WorkoutExerciseSet> => ({
            reps: Math.ceil(Math.random() * 12),
            weight: Math.ceil(Math.random() * 100),
          })
        )
        .map(partial => workoutExerciseSetRepo.create(partial))
      const workoutExerciseSetsSaved = await workoutExerciseSetRepo.save(
        workoutExerciseSetObjects
      )
      await db
        .createQueryBuilder()
        .relation(WorkoutExercise, 'sets')
        .of(workoutExerciseSaved)
        .add(workoutExerciseSetsSaved)

      await db
        .createQueryBuilder()
        .relation(WorkoutExercise, 'exercise')
        .of(workoutExerciseSaved)
        .add(bp)
    }

    // Getting complete workouts
    await workoutRepo
      .find({
        relations: { exercises: { exercise: true, sets: true, workout: true } },
      })
      .then(workouts => console.log({ workouts }))
  }
}
