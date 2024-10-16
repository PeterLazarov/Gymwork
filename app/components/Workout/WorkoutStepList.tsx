import { observer } from 'mobx-react-lite'
import React, { useRef, useState } from 'react'

import { Workout } from 'app/db/models'
import WorkoutStepCard from '../WorkoutStep/WorkoutStepCard'
import { useStores } from 'app/db/helpers/useStores'
import { FlatList } from 'react-native'

type Props = {
  workout: Workout
}

const WorkoutStepList: React.FC<Props> = ({ workout }) => {
  const {
    stateStore,
    navStore: { navigate },
  } = useStores()

  function onCardPress(stepGuid: string) {
    stateStore.setFocusedStep(stepGuid)
    navigate('WorkoutStep')

    // TODO uncomment for WIP scrollable list
    // if (stateStore.focusedStepGuid === stepGuid) {
    //   stateStore.setFocusedStep('')
    // } else {
    //   stateStore.setFocusedStep(stepGuid)
    //   listRef.current?.scrollToIndex({
    //     index: workout.steps.findIndex(s => s.guid === stepGuid),
    //     animated: true,
    //   })
    // }
  }

  const listRef = useRef<FlatList>(null)
  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [lastCardHeight, setLastCardHeight] = useState(0)

  return (
    <FlatList
      overScrollMode="always"
      ref={listRef}
      scrollToOverflowEnabled={true}
      onLayout={e => {
        if (!scrollViewHeight) {
          setScrollViewHeight(e.nativeEvent.layout.height)
        }
      }}
      data={workout.steps}
      renderItem={({ item, index }) => {
        const isLast = index === workout.steps.length - 1

        return (
          <WorkoutStepCard
            key={item.guid}
            step={item}
            onPress={() => onCardPress(item.guid)}
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
