import { observer } from 'mobx-react-lite'
import React, { useCallback, useRef } from 'react'
import { FlatList, View } from 'react-native'
import SetEditItem from './SetEditItem'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { colors, Divider, Icon, PressableHighlight } from 'designSystem'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'

type Props = {
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
}

const SetEditList: React.FC<Props> = ({ selectedSet, setSelectedSet }) => {
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
      const isRecord =
        stateStore.focusedExerciseRecords.recordSetsMap.hasOwnProperty(
          item.guid
        )

      return (
        <PressableHighlight
          style={{
            backgroundColor: isActive ? colors.primaryLighter : undefined,
          }}
          onLongPress={() => {
            onDragStart()
          }}
          onPressOut={() => {
            onDragEnd()
          }}
          onPress={() => toggleSelectedSet(item)}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: isActive ? 10 : undefined,
            }}
          >
            {isActive && <Icon icon="drag-horizontal-variant" />}

            <SetEditItem
              set={item}
              isFocused={selectedSet?.guid === item.guid}
              isRecord={isRecord}
              calcWorkSetNumber={calcWorkSetNumber}
              toggleSetWarmup={toggleSetWarmup}
            />
          </View>
        </PressableHighlight>
      )
    },
    [selectedSet, stateStore.focusedExerciseRecords.recordSetsMap]
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
    stateStore.focusedStep!.reorderSets(from, to)
  }

  const dragListRef = useRef<FlatList>(null)

  function calcWorkSetNumber(set: WorkoutSet) {
    const workArrayIndex = stateStore.focusedStep!.workSets.indexOf(set)
    return workArrayIndex + 1
  }

  function toggleSetWarmup(set: WorkoutSet) {
    set.setProp('isWarmup', !set.isWarmup)
  }
  return (
    <>
      <DragList
        data={stateStore.focusedStep!.sets}
        renderItem={renderItem}
        keyExtractor={set => set.guid}
        getItemLayout={getItemLayout}
        onReordered={handleReorder}
        ItemSeparatorComponent={() => <Divider orientation="horizontal" />}
        ref={dragListRef}
        onContentSizeChange={() =>
          dragListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {stateStore.focusedStep!.sets.length === 0 && (
        <EmptyState text={translate('noSetsEntered')} />
      )}
    </>
  )
}

export default observer(SetEditList)
