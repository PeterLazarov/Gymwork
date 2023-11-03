import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from 'react-native'

import WorkoutExerciseEntrySetEditPanel from './WorkoutExerciseEntrySetEditPanel'
import { WorkoutExerciseSetListItem } from './WorkoutExerciseSetListItem'
import { useDatabaseConnection } from '../dbold/DBProvider'
import { ButtonContainer, Divider } from '../designSystem'
import colors from '../designSystem/colors'
import { WorkoutExercise } from '../models/WorkoutExercise'
import { WorkoutExerciseSet } from '../models/workoutExerciseSet'

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
        set.id === updatedSet.id ? updatedSet : set
      ),
    }
    setWorkoutExercise(updatedExercise)
  }

  function toggleSelectedSet(set: WorkoutExerciseSet) {
    setSelectedSet(set.id === selectedSet?.id ? null : set)
  }

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: colors.secondary,
        padding: 16,
        // margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
      }}
    >
      <WorkoutExerciseEntrySetEditPanel
        selectedSet={selectedSet}
        addSet={addSet}
        updateSet={updateSet}
        removeSet={removeSet}
      />

      <ScrollView
        style={{
          backgroundColor: colors.secondary,
          padding: 12,
          borderRadius: 6,
        }}
      >
        {workoutExercise.sets.map((set, i) => (
          <>
            {i !== 0 && <Divider />}
            <ButtonContainer
              key={i}
              variant="tertiary"
              onPress={() => toggleSelectedSet(set)}
            >
              <WorkoutExerciseSetListItem
                set={set}
                isFocused={selectedSet?.id === set.id}
              />
            </ButtonContainer>
          </>
        ))}
      </ScrollView>
    </View>
  )
}

export default WorkoutExerciseEntry
