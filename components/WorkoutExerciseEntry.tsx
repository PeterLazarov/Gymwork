import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseEntrySetEditPanel from './WorkoutExerciseEntrySetEditPanel'
import { WorkoutExerciseSetListItem } from './WorkoutExerciseSetListItem'
import { ButtonContainer, Divider } from '../designSystem'
import colors from '../designSystem/colors'
import { WorkoutExercise } from '../models/WorkoutExercise'
import { WorkoutSet } from '../models/WorkoutSet'
import { useStores } from '../models/helpers/useStores'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  const { workoutStore } = useStores()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [workoutExercise, setWorkoutExercise] =
    useState<WorkoutExercise>(exercise)
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  async function addSet(setToAdd: Partial<WorkoutSet>) {
    const updatedExercise = workoutStore.addWorkoutExerciseSet(setToAdd)
    setWorkoutExercise(updatedExercise)
  }

  function removeSet(setToRemove: WorkoutSet) {
    const updatedExercise = workoutStore.removeWorkoutExerciseSet(
      setToRemove.guid
    )
    setWorkoutExercise(updatedExercise)
  }

  function updateSet(updatedSet: WorkoutSet) {
    const updatedExercise = workoutStore.updateWorkoutExerciseSet(updatedSet)
    setWorkoutExercise(updatedExercise)
  }

  function toggleSelectedSet(set: WorkoutSet) {
    setSelectedSet(set.guid === selectedSet?.guid ? null : set)
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
                isFocused={selectedSet?.guid === set.guid}
              />
            </ButtonContainer>
          </>
        ))}
      </ScrollView>
    </View>
  )
}

export default WorkoutExerciseEntry
