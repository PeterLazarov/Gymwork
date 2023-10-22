import { useAtom } from 'jotai'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'

import { dateAtom } from '../atoms'
import DayControl from '../components/DayControl'
import Layout from '../components/Layout'
import WorkoutControlButtons from '../components/WorkoutControlButtons'
import WorkoutExerciseEntry from '../components/WorkoutExerciseEntry'
import { Exercise, Workout } from '../db/models'
import { useDatabaseConnection } from '../db/setup'

export default function WorkoutPage() {
  const [globalDate] = useAtom(dateAtom)

  const globalDateISO = useMemo(() => globalDate.toISODate()!, [globalDate])

  const { workoutRepository, workoutExerciseRepository } =
    useDatabaseConnection()
  const [workout, setWorkout] = useState<Workout>()

  useEffect(() => {
    workoutRepository
      .find({
        where: {
          date: globalDateISO,
        },
        relations: {
          exercises: {
            sets: true,
            exercise: true,
          },
        },
      })
      .then(([workout]) => setWorkout(workout))
  }, [globalDateISO])

  function newWorkout() {
    const res = workoutRepository.create({
      date: globalDateISO,
      notes: '',
    })
    setWorkout(res)
  }

  async function addExercise(exercise: Exercise) {
    const workoutExercise = await workoutExerciseRepository.create({
      exercise,
      workout,
    })

    const updated = {
      ...workout!,
      exercises: [...workout!.exercises, workoutExercise],
    }

    // TODO: fuck this
    setWorkout(updated)
    workoutRepository.update(workout!.id, updated).then()
  }

  return (
    <Layout>
      <DayControl />

      <ScrollView>
        {workout?.exercises
          ?.sort((a, b) => a.id - b.id)
          .map((exercise, i) => (
            <WorkoutExerciseEntry
              key={`${workout.date}_${i}`}
              exercise={exercise}
            />
          ))}
      </ScrollView>

      <WorkoutControlButtons
        workout={workout}
        createWorkout={newWorkout}
        addExercise={addExercise}
      />
    </Layout>
  )
}
