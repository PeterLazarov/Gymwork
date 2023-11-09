import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseEntryEditPanel from './WorkoutExerciseEntryEditPanel'
import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet } from '../../db/models'
import { ButtonContainer, Divider } from '../../designSystem'
import { SectionLabel } from '../../designSystem/Label'
import colors from '../../designSystem/colors'

const WorkoutExerciseEntry: React.FC = () => {
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
      <WorkoutExerciseEntryEditPanel
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
          <View key={set.guid}>
            {i !== 0 && <Divider />}
            <ButtonContainer
              variant="tertiary"
              onPress={() => toggleSelectedSet(set)}
            >
              <WorkoutExerciseSetListItem
                set={set}
                isFocused={selectedSet?.guid === set.guid}
              />
            </ButtonContainer>
          </View>
        ))}
        {workoutStore.openedExercise.sets.length === 0 && (
          <SectionLabel> No sets entered </SectionLabel>
        )}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseEntry)
