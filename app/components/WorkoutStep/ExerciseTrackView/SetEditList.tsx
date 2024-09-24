import { observer } from 'mobx-react-lite'
import React, { useCallback, useRef } from 'react'
import {
  FlatList,
  Keyboard,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { computed } from 'mobx'

import SetEditItem from './SetEditItem'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { useColors, Divider, Icon } from 'designSystem'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'

type Props = {
  sets: WorkoutSet[]
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
}

const SetEditList: React.FC<Props> = ({
  sets = [],
  selectedSet,
  setSelectedSet,
}) => {
  const colors = useColors()

  const { stateStore, recordStore } = useStores()

  function toggleSelectedSet(set: WorkoutSet) {
    setSelectedSet(set.guid === selectedSet?.guid ? null : set)
  }

  const stepRecords = computed(() => {
    return stateStore.focusedStep
      ? recordStore.getRecordsForStep(stateStore.focusedStep)
      : []
  }).get()

  const renderItem = useCallback(
    ({
      item,
      onDragStart,
      onDragEnd,
      isActive,
    }: DragListRenderItemInfo<WorkoutSet>) => {
      const isRecord = stepRecords.some(({ guid }) => guid === item.guid)
      const isFocused = selectedSet?.guid === item.guid

      return (
        <TouchableOpacity
          style={{
            paddingHorizontal: 8,
            backgroundColor: isActive
              ? colors.primaryContainer
              : isFocused
              ? colors.surfaceContainerHigh
              : undefined,
          }}
          onLongPress={onDragStart}
          onPressOut={onDragEnd}
          onPress={e => {
            e.preventDefault()
            toggleSelectedSet(item)
          }}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: isActive ? 8 : undefined,
            }}
          >
            {isActive && (
              <Icon
                size="small"
                icon="drag-horizontal-variant"
              />
            )}

            <SetEditItem
              set={item}
              isRecord={isRecord}
              calcWorkSetNumber={calcWorkSetNumber}
              toggleSetWarmup={toggleSetWarmup}
            />
          </View>
        </TouchableOpacity>
      )
    },
    [selectedSet, stepRecords]
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
    const exerciseSets =
      stateStore.focusedStep!.exerciseSetsMap[set.exercise.guid] || []
    const workArrayIndex = exerciseSets.filter(s => !s.isWarmup).indexOf(set)
    return workArrayIndex + 1
  }

  function toggleSetWarmup(set: WorkoutSet) {
    set.setProp('isWarmup', !set.isWarmup)
  }
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        setSelectedSet(null)
        Keyboard.dismiss()
      }}
    >
      <DragList
        data={sets.slice()}
        renderItem={renderItem}
        keyExtractor={set => set.guid}
        getItemLayout={getItemLayout}
        onReordered={handleReorder}
        ItemSeparatorComponent={() => (
          <Divider
            orientation="horizontal"
            variant="neutral"
          />
        )}
        style={{
          paddingVertical: 8,
        }}
        ref={dragListRef}
        onContentSizeChange={() =>
          dragListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {!stateStore.focusedStep?.sets?.length && (
        <EmptyState text={translate('noSetsEntered')} />
      )}
    </Pressable>
  )
}

export default observer(SetEditList)
