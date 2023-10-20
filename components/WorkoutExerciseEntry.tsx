import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'

import WorkoutExerciseEntryHeader from './WorkoutExerciseEntryHeader'
import { WorkoutExerciseEntrySet } from './WorkoutExerciseEntrySet'
import { WorkoutExercise, WorkoutExerciseSet } from '../db/models'
import { useDatabaseConnection } from '../db/setup'

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

  function removeSet(setToRemove: WorkoutExerciseSet) {
    const updated = {
      ...workoutExercise,
      sets: workoutExercise.sets.filter(({ id }) => id !== setToRemove.id),
    }
    workoutExerciseRepository.update(exercise.id, updated)

    workoutExerciseSetRepository.delete(setToRemove.id)
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
          onRemove={removeSet}
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
