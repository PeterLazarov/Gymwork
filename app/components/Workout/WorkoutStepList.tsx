import { observer } from 'mobx-react-lite'
import React from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import { Workout, WorkoutStep } from 'app/db/models'
import WorkoutStepCard from '../WorkoutStep/WorkoutStepCard'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'

type Props = {
  workout: Workout
}

const WorkoutStepList: React.FC<Props> = ({ workout }) => {
  const { stateStore } = useStores()

  function onCardPress(stepGuid: string) {
    stateStore.setFocusedStep(stepGuid)
    // navigate('WorkoutStep')
  }

  const renderItem = ({ item }: ListRenderItemInfo<WorkoutStep>) => (
    <WorkoutStepCard
      step={item}
      onPress={() => onCardPress(item.guid)}
    />
  )

  return (
    <FlashList
      data={workout.steps.slice()}
      renderItem={renderItem}
      keyExtractor={item => `${workout!.date}_${item.guid}`}
      estimatedItemSize={140}
    />
  )
}
export default observer(WorkoutStepList)
