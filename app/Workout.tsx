import { useAtom } from 'jotai'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text } from 'react-native'

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
      .getAll({
        filter: {
          date: globalDateISO,
        },
        relations: {
          exercises: true,
        },
      })
      .then(([workout]) => setWorkout(workout))
  }, [globalDateISO])
  console.log({ workout })

  function newWorkout() {
    workoutRepository
      .create({
        date: globalDateISO,
        notes: '',
      })
      .then(setWorkout)
  }

  async function addExercise(exercise: Exercise) {
    console.log('adding exercise')
    const workoutExercise = await workoutExerciseRepository.create({
      exercise,
      workout,
    })

    workout!.exercises.push(workoutExercise)
    workoutRepository.update(workout!.id, workout!).then()

    setWorkout(workout)
  }

  return (
    <Layout>
      <DayControl />

      <ScrollView>
        <Text>
          {typeof workout}
          {workout?.date}
        </Text>
        {workout?.exercises?.map((exercise, i) => (
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
