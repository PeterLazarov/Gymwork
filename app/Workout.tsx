import React, { useMemo } from 'react'

import { useAtom, useAtomValue } from 'jotai'
import { workoutHistoryAtom, dateAtom } from '../atoms'
import Layout from '../components/Layout'
import WorkoutEntry from '../components/WorkoutEntry'
import { Button, ScrollView } from 'react-native'
import DayControl from '../components/DayControl'
import { Workout } from '../types/Workout'
import { DateTime } from 'luxon'
import { Text } from 'react-native'

// TODO show all workouts for the day
export default function WorkoutPage() {
  const [workoutHistory, setWorkoutHistory] = useAtom(workoutHistoryAtom)
  const [globalDate, setGlobalDate] = useAtom(dateAtom)

  const globalDateISO = useMemo(() => globalDate.toISODate()!, [globalDate])

  const selectedDayWorkouts = useMemo(() => {
    const data = workoutHistory[globalDateISO]

    console.log('currentDayWorkouts', data, workoutHistory)

    return data ?? []
  }, [workoutHistory, dateAtom])

  function newWorkout() {
    const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
    setGlobalDate(today)

    setWorkoutHistory({
      ...workoutHistory,
      [globalDate.toISODate()!]: (
        workoutHistory[globalDate.toISODate()!] ?? []
      ).concat([
        {
          date: today,
          work: [],
        },
      ]),
    })
  }

  return (
    <Layout>
      <DayControl />

      <ScrollView>
        {selectedDayWorkouts.map((workout, i) => (
          <WorkoutEntry
            key={`${workout.date.toISO}-${i}`}
            workout={workout}
            onChange={updatedWorkout => {
              console.log('in workout', JSON.stringify(updatedWorkout))
              setWorkoutHistory(
                {
                  ...workoutHistory,
                  [globalDateISO]: workoutHistory[globalDateISO].map(
                    (storedWorkout, _i) =>
                      i === _i ? updatedWorkout : storedWorkout
                  ),
                }

                // .map((_w, _i) => (_i === i ? _w : w))
              )
            }}
            // TODO onEndWorkout={}
            dayIndex={i}
          />
        ))}
      </ScrollView>

      <Button
        onPress={newWorkout}
        title="New workout"
      ></Button>
    </Layout>
  )
}
