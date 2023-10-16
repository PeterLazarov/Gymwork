import React, { useState } from 'react'
import { View, Text, Button, ScrollView, SafeAreaView } from 'react-native'

import DayControl from '../components/DayControl'
import Nav from '../components/Nav'
import ExercisePicker, { Exercise } from '../components/ExercisePicker'
import WorkoutExerciseEntry from '../components/WorkoutExerciseEntry'
import type { Workout } from '../types/Workout'
import { DateTime } from 'luxon'
import { useAtom } from 'jotai'
import { workoutHistoryAtom } from '../atoms'

const addExerciseButtonText = `
Add exercise
`
const endWorkoutButtonText = `
End workout
`

export default function WorkoutPage() {
  const [workoutHistory, setWorkoutHistory] = useAtom(workoutHistoryAtom)

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showExercisePicker, setShowExercisePicker] = useState(false)

  const work: Workout['work'] = []

  function addExercise() {
    setShowExercisePicker(true)
  }
  function handlePickExercise(exercise: Exercise) {
    setExercises(exercises.concat(exercise))
    setShowExercisePicker(false)
  }
  // TODO
  function handleChangeWork(
    exercise: Exercise,
    index: number,
    sets: Workout['work'][number]['sets']
  ) {
    work[index] = {
      exercise: exercise.name,
      sets,
    }
  }

  function endWorkout() {
    setWorkoutHistory(
      workoutHistory.concat({
        date: DateTime.now().set({ hour: 0, minute: 0, second: 0 }),
        work,
      })
    )
  }

  return (
    <SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Nav />
        <Text style={{ textAlign: 'center' }}>Workout</Text>
        <DayControl />

        {showExercisePicker && <ExercisePicker onChange={handlePickExercise} />}

        <ScrollView style={{ flexGrow: 1 }}>
          {exercises.map((exercise, i) => (
            <WorkoutExerciseEntry
              key={`${exercise.name}_${i}`}
              exercise={exercise}
              onChangeWork={({ sets }) => {
                handleChangeWork(exercise, i, sets)
              }}
            ></WorkoutExerciseEntry>
          ))}
        </ScrollView>

        <View
          style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 8 }}
        >
          <View style={{ flexGrow: 1 }}>
            <Button
              title={addExerciseButtonText}
              onPress={addExercise}
            />
          </View>
          <Button
            title={endWorkoutButtonText}
            onPress={endWorkout}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
