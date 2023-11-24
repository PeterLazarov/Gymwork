import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { View, FlatList, ListRenderItemInfo } from 'react-native'

import WorkoutExerciseSetEditItem from './WorkoutExerciseSetEditItem'
import { useStores } from '../../../db/helpers/useStores'
import { WorkoutSet } from '../../../db/models'
import { Divider } from '../../../designSystem'
import { SectionLabel } from '../../../designSystem/Label'

type Props = {
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
}

const WorkoutExerciseSetEditList: React.FC<Props> = ({
  selectedSet,
  setSelectedSet,
}) => {
  const { stateStore } = useStores()

  function toggleSelectedSet(set: WorkoutSet) {
    setSelectedSet(set.guid === selectedSet?.guid ? null : set)
  }

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<WorkoutSet>) => {
      return (
        <WorkoutExerciseSetEditItem
          set={item}
          isFocused={selectedSet?.guid === item.guid}
          onPress={() => toggleSelectedSet(item)}
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
    // TODO: offset messed up on set added / removed
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * (index + 1),
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
        data={stateStore.openedExerciseSets}
        renderItem={renderItem}
        keyExtractor={set => set.guid}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={Divider}
      />

      {stateStore.openedExerciseSets.length === 0 && (
        <SectionLabel> No sets entered </SectionLabel>
      )}
    </View>
  )
}

export default observer(WorkoutExerciseSetEditList)
