import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'

import WorkoutExerciseEntryHeader from './WorkoutExerciseEntryHeader'
import { WorkoutExerciseEntrySet } from './WorkoutExerciseEntrySet'
import { WorkoutExercise } from '../db/models'
import { useDatabaseConnection } from '../db/setup'
import { ExerciseSet } from '../types/ExerciseSet'

const defaultSet: ExerciseSet = { reps: 8, weight: 20, weightUnit: 'kg' }

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  const [workoutExercise, setWorkoutExercise] =
    useState<WorkoutExercise>(exercise)
  const { workoutExerciseRepository, workoutExerciseSetRepository } =
    useDatabaseConnection()

  async function addSet() {
    const newSet = await workoutExerciseSetRepository.create({
      workoutExercise,
    })

    const updated = {
      ...workoutExercise,
      sets: [...workoutExercise.sets, newSet],
    }
    workoutExerciseRepository.update(exercise.id, updated)
    setWorkoutExercise(updated)
  }

  return (
    <View
      style={{
        backgroundColor: '#f4f4f4',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        gap: 24,
      }}
    >
      {/* <Caption style={{ marginBottom: 16, fontWeight: 'bold' }}> */}
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {workoutExercise.name}
      </Text>
      {/* </Caption> */}

      <WorkoutExerciseEntryHeader />

      {workoutExercise.sets.map((set, i) => (
        <WorkoutExerciseEntrySet
          key={i}
          set={set}
          onChange={set => {
            // props.onChangeSets(
            //   props.sets.map((_s, _i) => (i === _i ? set : _s))
            // )
          }}
          onRemove={() => {
            // props.onChangeSets(props.sets.filter((_, _i) => _i !== i))
          }}
        />
      ))}

      <Button
        title="Add set"
        onPress={addSet}
      />
    </View>
  )
}

export default WorkoutExerciseEntry
