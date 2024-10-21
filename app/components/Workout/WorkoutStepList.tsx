import { observer } from 'mobx-react-lite'
import React, { useRef, useState } from 'react'

import { Workout, WorkoutStep } from 'app/db/models'
import WorkoutStepCard from '../WorkoutStep/WorkoutStepCard'
import { useStores } from 'app/db/helpers/useStores'
import { FlatList, ListRenderItem } from 'react-native'
import { useColors } from 'designSystem'
import { computed } from 'mobx'

type Props = {
  workout: Workout
}

const WorkoutStepList: React.FC<Props> = ({ workout }) => {
  const {
    stateStore,
    navStore: { navigate },
  } = useStores()

  const colors = useColors()

  // function onCardPress(stepGuid: string) {
  //   // stateStore.setFocusedStep(stepGuid)
  //   // navigate('WorkoutStep')

  //   // TODO uncomment for WIP scrollable list
  //   if (stateStore.focusedStepGuid === stepGuid) {
  //     stateStore.setFocusedStep('')
  //   } else {
  //     stateStore.setFocusedStep(stepGuid)
  //     listRef.current?.scrollToIndex({
  //       index: workout.steps.findIndex(s => s.guid === stepGuid),
  //       animated: true,
  //     })
  //   }
  // }

  function scrollToStep(stepGuid: string) {
    console.log('scrolling to step')
    listRef.current?.scrollToIndex({
      index: workout.steps.findIndex(s => s.guid === stepGuid),
      animated: true,
    })
  }

  const listRef = useRef<FlatList>(null)
  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [lastCardHeight, setLastCardHeight] = useState(0)
  const [scrollEnabled, setScrollEnabled] = useState(true)

  return (
    <FlatList
      ref={listRef}
      scrollEnabled={scrollEnabled}
      onLayout={e => {
        if (!scrollViewHeight) {
          setScrollViewHeight(e.nativeEvent.layout.height)
        }
      }}
      data={workout.steps}
      extraData={[stateStore.focusedStepGuid, stateStore.highlightedSet]}
      renderItem={({ item, index }) => {
        const isLast = index === workout.steps.length - 1
        const isSelected = item.guid === stateStore.focusedStepGuid

        return (
          <WorkoutStepCard
            onDragStart={() => {
              setScrollEnabled(false)
            }}
            onDragEnd={() => {
              setScrollEnabled(true)
            }}
            // TODO performance-optimize?
            onPressAdd={() => {
              console.log('press card add')
            }}
            onPress={() => {
              console.log('press card', item.guid)
            }}
            key={item.guid}
            step={item}
            style={{
              backgroundColor: isSelected
                ? colors.surfaceContainerLowest
                : undefined,
              borderRadius: 4,
            }}
            selectedSet={stateStore.highlightedSet ?? null}
            onSelectSet={set => {
              stateStore.setFocusedStep(item.guid)
              stateStore.setProp('highlightedSetGuid', set.guid)
              // stateStore.draftSet
              console.log('press set', set?.guid)
              scrollToStep(item.guid)
              // onCardPress(item.guid)
              stateStore.setProp('highlightedSetGuid', set?.guid)
            }}
            // onPress={() => onCardPress(item.guid)}
            onLayout={e => {
              if (isLast && !lastCardHeight) {
                setLastCardHeight(e.nativeEvent.layout.height)
              }
            }}
            containerStyle={{
              marginBottom: isLast
                ? Math.max(scrollViewHeight - lastCardHeight - 8, 0)
                : undefined,
            }}
          />
        )
      }}
    />
  )
}
export default observer(WorkoutStepList)
