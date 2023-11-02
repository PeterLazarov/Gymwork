import { useAtom } from 'jotai'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'

import { dateAtom } from '../atoms'
import DayControl from '../components/DayControl'
import WorkoutControlButtons from '../components/WorkoutControlButtons'
import WorkoutExerciseListItem from '../components/WorkoutExerciseListItem'
import { useDatabaseConnection } from '../dbold/DBProvider'
import { Workout, WorkoutModel } from '../models/Workout'
import { useStores } from '../models/helpers/useStores'

export default function WorkoutPage() {
  const [globalDate] = useAtom(dateAtom)

  const globalDateISO = useMemo(() => globalDate.toISODate()!, [globalDate])

  const { workoutStore } = useStores()
  const { workoutRepository, workoutExerciseRepository } =
    useDatabaseConnection()
  const [workout, setWorkout] = useState<Workout>()

  useEffect(() => {
    const [workout] = workoutStore.workouts.filter(
      w => w.date === globalDateISO
    )
    setWorkout(workout)
  }, [globalDateISO, workoutStore])

  function newWorkout() {
    const workout = workoutStore.createWorkout(globalDateISO)
    setWorkout(workout)
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
    <View>
      <DayControl />

      <ScrollView>
        {/* TODO: replace sorted with toSorted */}
        {workout?.exercises
          ?.sort((a, b) => a.id - b.id)
          .map((exercise, i) => (
            <WorkoutExerciseListItem
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
    </View>
  )
}
