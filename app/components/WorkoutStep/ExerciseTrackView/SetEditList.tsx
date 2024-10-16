import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo, useRef } from 'react'
import {
  FlatList,
  Keyboard,
  Pressable,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
} from 'react-native'
// import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { computed } from 'mobx'

import SetEditItem from './SetEditItem'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { useColors, Divider, Icon } from 'designSystem'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'
import {
  Draggable,
  DraggableStack,
  DraggableStackProps,
} from '@mgcrea/react-native-dnd'

type Props = {
  step: WorkoutStep
  sets: WorkoutSet[]
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
  hideFallback?: boolean
}

const SetEditList: React.FC<Props> = ({
  step,
  sets = [],
  selectedSet,
  setSelectedSet,
  hideFallback,
}) => {
  const colors = useColors()

  const { stateStore, recordStore, settingsStore } = useStores()
  step = step || stateStore.focusedStep

  function toggleSelectedSet(set: WorkoutSet) {
    setSelectedSet(set.guid === selectedSet?.guid ? null : set)
  }

  const stepRecords = useMemo(
    () =>
      computed(() => {
        return step ? recordStore.getRecordsForStep(step) : []
      }),
    [step]
  ).get()

  const renderItem = useCallback(
    ({
      item,
      // onDragStart,
      // onDragEnd,
      // isActive,
      index,
    }: ListRenderItemInfo<WorkoutSet>) => {
      const isRecord = stepRecords.some(({ guid }) => guid === item.guid)
      const isFocused = selectedSet?.guid === item.guid
      const isDraft = index === sets.length

      return (
        <TouchableOpacity
          key={item.guid}
          style={{
            // paddingHorizontal: 8,
            borderRadius: 4,
            backgroundColor:
              // isActive
              // ? colors.primaryContainer
              // :
              isFocused ? colors.surfaceContainerHigh : undefined,
          }}
          // onLongPress={() => {
          //   !isDraft && onDragStart()
          // }}
          // onPressOut={() => {
          //   !isDraft && onDragEnd()
          // }}
          onPress={e => {
            e.preventDefault()
            if (!isDraft) {
              toggleSelectedSet(item)
            }
          }}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              // paddingLeft: isActive ? 8 : undefined,
            }}
          >
            {/* {isActive && (
              <Icon
                size="small"
                icon="drag-horizontal-variant"
              />
            )} */}

            <SetEditItem
              set={item}
              isRecord={isRecord}
              number={step!.setNumberMap[item.guid]}
              toggleSetWarmup={toggleSetWarmup}
              draft={isDraft}
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

  // const handleReorder: (from: number, to: number) => Promise<void> | void = (
  //   from,
  //   to
  // ) => {
  //   step!.reorderSets(from, to)
  // }

  const onStackOrderChange: DraggableStackProps['onOrderChange'] = value => {
    console.log('onStackOrderChange', value)
  }
  const onStackOrderUpdate: DraggableStackProps['onOrderUpdate'] = value => {
    console.log('onStackOrderUpdate', value)
  }

  const flatListRef = useRef<FlatList>(null)

  function toggleSetWarmup(set: WorkoutSet) {
    set.setProp('isWarmup', !set.isWarmup)
  }

  if (!sets) return null

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        setSelectedSet(null)
        Keyboard.dismiss()
      }}
    >
      <DraggableStack
        direction="column"
        gap={10}
        style={{
          paddingVertical: 8,
        }}
        onOrderChange={onStackOrderChange}
        onOrderUpdate={onStackOrderUpdate}
      >
        {sets
          .concat(
            ...[
              !selectedSet && settingsStore.previewNextSet
                ? stateStore.draftSet
                : undefined,
            ].filter(Boolean)
          )
          .map((item, index) => (
            <Draggable
              key={item.guid ?? 123}
              id={item.guid ?? 123}
            >
              {renderItem({ item, index, separators: null as any })}
            </Draggable>
          ))}
      </DraggableStack>

      {!step?.sets?.length && !hideFallback && (
        <EmptyState text={translate('noSetsEntered')} />
      )}
    </Pressable>
  )
}

export default observer(SetEditList)
