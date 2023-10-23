import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseEntrySetEditPanel from './WorkoutExerciseEntrySetEditPanel'
import { WorkoutExerciseSetListItem } from './WorkoutExerciseSetListItem'
import { WorkoutExercise, WorkoutExerciseSet } from '../db/models'
import { useDatabaseConnection } from '../db/setup'
import { ButtonContainer } from '../designSystem'
import colors from '../designSystem/colors'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [workoutExercise, setWorkoutExercise] =
    useState<WorkoutExercise>(exercise)
  const [selectedSet, setSelectedSet] = useState<WorkoutExerciseSet | null>(
    null
  )
  const { workoutExerciseRepository, workoutExerciseSetRepository } =
    useDatabaseConnection()

  async function addSet(setToAdd: Partial<WorkoutExerciseSet>) {
    const newSet = await workoutExerciseSetRepository.create({
      workoutExercise,
      ...setToAdd,
    })

    const updated = {
      ...workoutExercise,
      sets: [...workoutExercise.sets, newSet],
    }
    workoutExerciseRepository.update(exercise.id, updated)
    setWorkoutExercise(updated)
  }

  function removeSet(setToRemove: WorkoutExerciseSet) {
    console.log('removed')
    console.log(setToRemove)
    console.log('intial')
    console.log(workoutExercise.sets)
    console.log('result')
    console.log(workoutExercise.sets.filter(({ id }) => id !== setToRemove.id))
    const updated = {
      ...workoutExercise,
      sets: workoutExercise.sets.filter(({ id }) => id !== setToRemove.id),
    }
    workoutExerciseRepository.update(exercise.id, updated)

    workoutExerciseSetRepository.delete(setToRemove.id)
    setWorkoutExercise(updated)
  }

  function updateSet(updatedSet: WorkoutExerciseSet) {
    workoutExerciseSetRepository.update(updatedSet.id, updatedSet)

    const updatedExercise = {
      ...workoutExercise,
      sets: workoutExercise.sets.map(set =>
        set.id === updatedSet.id ? updateSet : set
      ),
    }
    setWorkoutExercise(updatedExercise)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.secondary,
        padding: 16,
        margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
      }}
    >
      <WorkoutExerciseEntrySetEditPanel
        selectedSet={selectedSet}
        addSet={addSet}
        updateSet={updateSet}
        removeSet={() => removeSet}
      />

      <ScrollView>
        {workoutExercise.sets
          .sort((a, b) => a.id - b.id)
          .map((set, i) => (
            <ButtonContainer
              key={i}
              variant="tertiary"
              onPress={() => setSelectedSet(set)}
            >
              <WorkoutExerciseSetListItem
                set={set}
                style={{ color: colors.primary }}
              />
            </ButtonContainer>
          ))}
      </ScrollView>
    </View>
  )
}

export default WorkoutExerciseEntry
