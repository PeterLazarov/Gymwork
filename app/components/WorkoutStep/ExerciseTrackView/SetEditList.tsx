import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { getParentOfType } from 'mobx-state-tree'
import React, { useCallback, useMemo, useRef } from 'react'
import {
  FlatList,
  Keyboard,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'

import { useAppTheme } from '@/utils/useAppTheme'
import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutModel, WorkoutSet, WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { Divider, Icon } from 'designSystem'
import { spacing } from 'designSystem/theme/spacing'

import SetEditItem from './SetEditItem'

type Props = {
  step: WorkoutStep
  sets: WorkoutSet[]
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
  showFallback?: boolean
}

const SetEditList: React.FC<Props> = ({
  step,
  sets = [],
  selectedSet,
  setSelectedSet,
  showFallback = true,
}) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const { stateStore, recordStore, settingsStore } = useStores()

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

  const showSetCompletion =
    settingsStore.showSetCompletion &&
    getParentOfType(step, WorkoutModel).hasIncompleteSets

  const renderItem = useCallback(
    ({
      item,
      onDragStart,
      onDragEnd,
      isActive,
      index,
    }: DragListRenderItemInfo<WorkoutSet>) => {
      const isRecord = stepRecords.some(({ guid }) => guid === item.guid)
      const isFocused = selectedSet?.guid === item.guid
      const isDraft = index === sets.length

      return (
        <TouchableOpacity
          style={{
            paddingHorizontal: spacing.xs,
            backgroundColor: isActive
              ? colors.primaryContainer
              : isFocused
                ? colors.surfaceContainerHigh
                : isDraft
                  ? colors.surfaceContainer
                  : undefined,
          }}
          onLongPress={() => {
            !isDraft && onDragStart()
          }}
          onPressOut={() => {
            !isDraft && onDragEnd()
          }}
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
              paddingLeft: isActive ? spacing.xs : undefined,
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
              number={step!.setNumberMap[item.guid]}
              toggleSetWarmup={toggleSetWarmup}
              draft={isDraft}
              showSetCompletion={showSetCompletion}
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
    step!.reorderSets(from, to)
  }

  const dragListRef = useRef<FlatList>(null)

  function toggleSetWarmup(set: WorkoutSet) {
    set.setProp('isWarmup', !set.isWarmup)
  }

  if (showFallback && !sets?.length && !settingsStore.previewNextSet)
    return <EmptyState text={translate('noSetsEntered')} />
  if (!sets?.length && !settingsStore.previewNextSet) return <View></View>

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        setSelectedSet(null)
        Keyboard.dismiss()
      }}
    >
      <DragList
        data={sets.concat(
          ...[
            !selectedSet && settingsStore.previewNextSet
              ? stateStore.draftSet
              : undefined,
          ].filter(Boolean)
        )}
        renderItem={renderItem}
        keyExtractor={set => set.guid || 'draft'}
        getItemLayout={getItemLayout}
        onReordered={handleReorder}
        ItemSeparatorComponent={() => (
          <Divider
            orientation="horizontal"
            variant="neutral"
          />
        )}
        style={{
          paddingVertical: spacing.xs,
        }}
        ref={dragListRef}
        onContentSizeChange={() =>
          dragListRef.current?.scrollToEnd({ animated: true })
        }
      />
    </Pressable>
  )
}

export default observer(SetEditList)
