import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo, useRef } from 'react'
import { FlatList, View } from 'react-native'
import { computed } from 'mobx'

import WorkoutExerciseSetEditItem from './WorkoutExerciseSetEditItem'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { colors, Divider, Icon, PressableHighlight } from 'designSystem'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { isCurrentRecord } from 'app/services/workoutRecordsCalculator'

type Props = {
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
}

const WorkoutExerciseSetEditList: React.FC<Props> = ({
  selectedSet,
  setSelectedSet,
}) => {
  const { stateStore, workoutStore } = useStores()

  const setRecordFlagMap = useMemo(
    () =>
      computed(() => {
        const openedExerciseRecords = stateStore.getOpenedExerciseRecords()

        return stateStore.openedExerciseSets.reduce((acc, set) => {
          const isSetRecord = isCurrentRecord(openedExerciseRecords, set)
          acc[set.guid] = isSetRecord

          return acc
        }, {} as Record<string, boolean>)
      }),
    [stateStore.openedExerciseSets]
  ).get()

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

            <WorkoutExerciseSetEditItem
              set={item}
              isFocused={selectedSet?.guid === item.guid}
              isRecord={setRecordFlagMap[item.guid]}
              calcWorkSetNumber={calcWorkSetNumber}
              toggleSetWarmup={toggleSetWarmup}
            />
          </View>
        </PressableHighlight>
      )
    },
    [selectedSet, setRecordFlagMap]
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

  const dragListRef = useRef<FlatList>(null)

  function calcWorkSetNumber(set: WorkoutSet) {
    const workArrayIndex = stateStore.openedExerciseWorkSets.indexOf(set)
    return workArrayIndex + 1
  }

  function toggleSetWarmup(set: WorkoutSet) {
    workoutStore.setWorkoutSetWarmup(set, !set.isWarmup)
  }
  return (
    <>
      <DragList
        data={stateStore.openedExerciseSets}
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

      {stateStore.openedExerciseSets.length === 0 && (
        <EmptyState text={translate('noSetsEntered')} />
      )}
    </>
  )
}

export default observer(WorkoutExerciseSetEditList)
