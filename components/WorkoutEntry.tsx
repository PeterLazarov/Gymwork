import { View, ScrollView, Button, Text } from 'react-native'
import { Workout } from '../types/Workout'
import ExercisePicker from './ExercisePicker'
import WorkoutExerciseEntry from './WorkoutExerciseEntry'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { weightUnitAtom } from '../atoms'
import { useAtomValue } from 'jotai'
import { Exercise } from '../types/Exercise'

const addExerciseButtonText = `
Add exercise
`
const endWorkoutButtonText = `
End workout
`
type ExerciseSet = {
  weight: number
  reps: number
  completedAt?: DateTime
}
const defaultSet: ExerciseSet = { reps: 8, weight: 20 }

export default function WorkoutEntry(props: {
  workout: Workout
  dayIndex: number
  onChange?: (workout: Workout) => void
  onEndWorkout?: () => void
}) {
  const weightUnit = useAtomValue(weightUnitAtom)

  const [showExercisePicker, setShowExercisePicker] = useState(false)

  // let work: Workout['work'] = []

  function openExercisePicker() {
    setShowExercisePicker(true)
  }
  function handleAddExercise(exercise: Exercise) {
    props.onChange?.({
      ...props.workout,
      work: props.workout.work.concat({
        exercise: exercise,
        sets: [
          { reps: defaultSet.reps, weight: defaultSet.weight, weightUnit },
        ],
      }),
    })
    setShowExercisePicker(false)
  }
  function handleChangeSets(
    exercise: Exercise,
    index: number,
    sets: Workout['work'][number]['sets']
  ) {
    props.onChange?.({
      work: props.workout.work.map((entry, i) =>
        i === index ? { ...entry, sets } : entry
      ),
      date: props.workout.date,
    })
  }

  function endWorkout() {
    props.onEndWorkout?.()
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
        Workout {props.dayIndex + 1}
      </Text>

      {showExercisePicker && <ExercisePicker onChange={handleAddExercise} />}

      <ScrollView style={{ flexGrow: 1 }}>
        {props.workout.work.map(({ exercise, sets }, i) => (
          <WorkoutExerciseEntry
            key={`${exercise.name}_${i}`}
            exercise={exercise}
            sets={sets}
            onChangeSets={sets => {
              handleChangeSets(exercise, i, sets)
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
            onPress={openExercisePicker}
          />
        </View>
        <Button
          title={endWorkoutButtonText}
          onPress={endWorkout}
        />
      </View>
    </View>
  )
}
