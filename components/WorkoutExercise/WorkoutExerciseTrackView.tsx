import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo, useState } from 'react'
import { View, ScrollView, FlatList } from 'react-native'

import WorkoutExerciseEntryEditPanel from './WorkoutExerciseEntryEditPanel'
import WorkoutExerciseSetEditItem from './WorkoutExerciseSetEditItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet, WorkoutSetSnapshotIn } from '../../db/models'
import { ButtonContainer, Divider } from '../../designSystem'
import { SectionLabel } from '../../designSystem/Label'
import colors from '../../designSystem/colors'

const WorkoutExerciseTrackView: React.FC = () => {
  const { workoutStore } = useStores()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  async function addSet(setToAdd: Pick<WorkoutSet, 'reps' | 'weight'>) {
    workoutStore.addSet({
      ...setToAdd,
      exercise: workoutStore.openedExerciseGuid,
    })
  }

  const warmupSetsCount = useMemo(
    () =>
      workoutStore.currentWorkoutOpenedExerciseSets.filter(e => e.isWarmup)
        .length,
    [workoutStore.currentWorkoutOpenedExerciseSets]
  )

  function removeSet(setToRemove: WorkoutSet) {
    const sets = workoutStore.currentWorkoutOpenedExerciseSets
    const i = sets.indexOf(setToRemove)
    const nextSet = sets[i + 1]
    const prevSet = sets[i - 1]
    setSelectedSet(nextSet ?? prevSet ?? null)
    workoutStore.removeSet(setToRemove.guid)
  }

  function updateSet(updatedSet: WorkoutSet) {
    workoutStore.updateWorkoutExerciseSet(updatedSet)
  }

  function toggleSelectedSet(set: WorkoutSet) {
    setSelectedSet(set.guid === selectedSet?.guid ? null : set)
  }
  const renderItem = useCallback(
    ({ item, index }: { item: WorkoutSet; index: number }) => {
      return (
        <WorkoutExerciseSetEditItem
          set={item}
          isFocused={selectedSet?.guid === item.guid}
          onPress={() => toggleSelectedSet(item)}
          number={item.isWarmup ? undefined : index + 1 - warmupSetsCount}
        />
      )
    },
    []
  )
  const ITEM_HEIGHT = 20
  const getItemLayout = (
    data: ArrayLike<WorkoutSet> | null | undefined,
    index: number
  ) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }
  }
  return (
    <View
      style={{
        padding: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
        flexGrow: 1,
        display: 'flex',
      }}
    >
      <WorkoutExerciseEntryEditPanel
        selectedSet={selectedSet}
        addSet={addSet}
        updateSet={updateSet}
        removeSet={removeSet}
      />

      <View
        style={{
          backgroundColor: colors.secondary,
          borderRadius: 6,
          flexBasis: 0,
          flex: 1,
        }}
      >
        <FlatList
          data={workoutStore.currentWorkoutOpenedExerciseSets}
          renderItem={renderItem}
          keyExtractor={set => set.guid}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={Divider}
        />

        {workoutStore.currentWorkoutOpenedExerciseSets.length === 0 && (
          <SectionLabel> No sets entered </SectionLabel>
        )}
      </View>
    </View>
  )
}

export default observer(WorkoutExerciseTrackView)
