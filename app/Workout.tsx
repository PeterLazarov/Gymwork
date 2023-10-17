import React, { useMemo } from 'react'

import { useAtom, useAtomValue } from 'jotai'
import { workoutHistoryAtom, dateAtom } from '../atoms'
import Layout from '../components/Layout'
import WorkoutEntry from '../components/WorkoutEntry'
import { Button, ScrollView } from 'react-native'
import DayControl from '../components/DayControl'
import { Workout } from '../types/Workout'
import { DateTime } from 'luxon'

// TODO show all workouts for the day
export default function WorkoutPage() {
  const [workoutHistory, setWorkoutHistory] = useAtom(workoutHistoryAtom)
  const [globalDate, setGlobalDate] = useAtom(dateAtom)

  const currentDayWorkouts = useMemo(() => {
    return workoutHistory.filter(
      workout => workout.date.toISODate() === globalDate.toISODate()
    )
  }, [workoutHistory, dateAtom])

  function newWorkout() {
    const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
    setGlobalDate(today)
    setWorkoutHistory(
      workoutHistory.concat([
        {
          date: today,
          work: [],
        },
      ])
    )
  }

  return (
    <Layout>
      <DayControl />

      <ScrollView>
        {currentDayWorkouts.map((workout, i) => (
          <WorkoutEntry
            key={`${workout.date.toISO}-${i}`}
            workout={workout}
            onChange={w => {
              setWorkoutHistory(
                workoutHistory.map((_w, _i) => (_i === i ? _w : w))
              )
            }}
            // onEndWorkout={}
            dayIndex={0}
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
