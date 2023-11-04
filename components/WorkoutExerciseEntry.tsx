import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseEntrySetEditPanel from './WorkoutExerciseEntrySetEditPanel'
import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
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
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  async function addSet(setToAdd: Partial<WorkoutSet>) {
    workoutStore.addWorkoutExerciseSet(setToAdd)
  }

  function removeSet(setToRemove: WorkoutSet) {
    workoutStore.removeWorkoutExerciseSet(setToRemove.guid)
  }

  function updateSet(updatedSet: WorkoutSet) {
    workoutStore.updateWorkoutExerciseSet(updatedSet)
  }

  function toggleSelectedSet(set: WorkoutSet) {
    setSelectedSet(set.guid === selectedSet?.guid ? null : set)
  }
  console.log('rerender')
  return (
    <View
      style={{
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
        {workoutStore.openedExercise.sets.map((set, i) => (
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

export default observer(WorkoutExerciseEntry)
