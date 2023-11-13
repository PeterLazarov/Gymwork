import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useMemo } from 'react'
import { View, FlatList } from 'react-native'

import WorkoutExerciseSetEditItem from './WorkoutExerciseSetEditItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet } from '../../db/models'
import { Divider } from '../../designSystem'
import { SectionLabel } from '../../designSystem/Label'

type Props = {
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
}

const WorkoutExerciseSetEditList: React.FC<Props> = ({
  selectedSet,
  setSelectedSet,
}) => {
  const { workoutStore } = useStores()

  const warmupSetsCount = useMemo(
    () =>
      workoutStore.currentWorkoutOpenedExerciseSets.filter(e => e.isWarmup)
        .length,
    [workoutStore.currentWorkoutOpenedExerciseSets]
  )

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
    [selectedSet]
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
  )
}

export default observer(WorkoutExerciseSetEditList)
