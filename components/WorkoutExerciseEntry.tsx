import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import WorkoutExerciseEntryHeader from './WorkoutExerciseEntryHeader'
import WorkoutExerciseEntrySet from './WorkoutExerciseEntrySet'
import { openedWorkoutExerciseAtom } from '../atoms'
import { WorkoutExercise, WorkoutExerciseSet } from '../db/models'
import { useDatabaseConnection } from '../db/setup'
import { ButtonContainer, ButtonText, Divider } from '../designSystem'
import texts from '../texts'
import { SubSectionLabel } from '../designSystem/Label'
import WorkoutExerciseEntrySetEditPanel from './WorkoutExerciseEntrySetEditPanel'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOpenedWorkoutExercise] = useAtom(openedWorkoutExerciseAtom)

  const [workoutExercise, setWorkoutExercise] =
    useState<WorkoutExercise>(exercise)
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
        backgroundColor: '#f4f4f4',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
      }}
    >
      <WorkoutExerciseEntrySetEditPanel
        editedSet={workoutExercise.sets?.[0]}
        addSet={addSet}
        updateSet={updateSet}
        removeSet={() => removeSet}
      />

      {/* <ScrollView>
        {workoutExercise.sets
          .sort((a, b) => a.id - b.id)
          .map((set, i) => (
            <WorkoutExerciseEntrySet
              key={i}
              set={set}
              onRemove={removeSet}
              onUpdate={updateSet}
            />
          ))}
      </ScrollView> */}
      {/* <ButtonContainer
        variant="primary"
        onPress={addSet}
      >
        <ButtonText variant="primary">{texts.addSet}</ButtonText>
      </ButtonContainer> */}
    </View>
  )
}

export default WorkoutExerciseEntry
