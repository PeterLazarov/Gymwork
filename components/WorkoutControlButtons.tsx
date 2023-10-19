import { useState } from 'react'
import { View, Button } from 'react-native'

import ExercisePicker from './ExercisePicker'
import { Workout, Exercise } from '../db/models'

type Props = {
  workout?: Workout
  createWorkout: () => void
  addExercise: (exercise: Exercise) => void
}

const addExerciseButtonText = `
Add exercise
`
const endWorkoutButtonText = `
End workout
`

const WorkoutControlButtons: React.FC<Props> = ({
  workout,
  createWorkout,
  addExercise,
}) => {
  const [showExercisePicker, setShowExercisePicker] = useState(false)

  function openExercisePicker() {
    setShowExercisePicker(true)
  }

  function handleAddExercise(exercise: Exercise) {
    // props.onChange?.({
    //   ...props.workout,
    //   work: props.workout.work.concat({
    //     exercise,
    //     sets: [
    //       { reps: defaultSet.reps, weight: defaultSet.weight, weightUnit },
    //     ],
    //   }),
    // })
    addExercise(exercise)
    setShowExercisePicker(false)
  }

  function endWorkout() {
    // TODO
  }
  return (
    <>
      {showExercisePicker && <ExercisePicker onChange={handleAddExercise} />}

      <View
        style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 8 }}
      >
        <View style={{ flexGrow: 1 }}>
          {!workout && (
            <Button
              onPress={createWorkout}
              title="New workout"
            />
          )}
          {workout && (
            <Button
              title={addExerciseButtonText}
              onPress={openExercisePicker}
            />
          )}
        </View>
        <Button
          title={endWorkoutButtonText}
          onPress={endWorkout}
        />
      </View>
    </>
  )
}

export default WorkoutControlButtons
