import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'

import WorkoutExerciseSetEditItem from './WorkoutExerciseSetEditItem'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { colors, Divider } from 'designSystem'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'

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
    ({
      item,
      onDragStart,
      onDragEnd,
      isActive,
    }: DragListRenderItemInfo<WorkoutSet>) => {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: isActive ? colors.primaryLight : undefined,
          }}
          onLongPress={() => {
            onDragStart()
          }}
          onPressOut={() => {
            onDragEnd()
          }}
          onPress={() => toggleSelectedSet(item)}
        >
          <WorkoutExerciseSetEditItem
            set={item}
            isFocused={selectedSet?.guid === item.guid}
          />
        </TouchableOpacity>
      )
    },
    [selectedSet]
  )
  const ITEM_HEIGHT = 62
  const getItemLayout = (
    data: ArrayLike<WorkoutSet> | null | undefined,
    index: number
  ) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * (index + 1),
      index,
    }
  }

  const handleReorder: (from: number, to: number) => Promise<void> | void = (
    from,
    to
  ) => {
    stateStore.reorderOpenedExerciseSets(from, to)
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <DragList
        data={stateStore.openedExerciseSets}
        renderItem={renderItem}
        keyExtractor={set => set.guid}
        getItemLayout={getItemLayout}
        onReordered={handleReorder}
        ItemSeparatorComponent={() => <Divider orientation="horizontal" />}
      />

      {stateStore.openedExerciseSets.length === 0 && (
        <EmptyState text={translate('noSetsEntered')} />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseSetEditList)
