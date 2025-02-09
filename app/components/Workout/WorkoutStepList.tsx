import { useNavigation } from '@react-navigation/native'
import { ListRenderItemInfo } from '@shopify/flash-list'
import { observer } from 'mobx-react-lite'
import React from 'react'

import { TabHeightCompensation } from '@/navigators/constants'
import { useStores } from 'app/db/helpers/useStores'
import { Workout, WorkoutStep } from 'app/db/models'
import { IndicatedScrollList } from 'designSystem'

import WorkoutStepCard from '../WorkoutStep/WorkoutStepCard'

import { WorkoutBottomControlsHeight } from './WorkoutBottomControls'

export type WorkoutStepListProps = {
  workout: Workout
}

const WorkoutStepList: React.FC<WorkoutStepListProps> = ({ workout }) => {
  const { stateStore } = useStores()

  const { navigate } = useNavigation()

  function onCardPress(stepGuid: string) {
    stateStore.setFocusedStep(stepGuid)
    console.log('navigating to step')
    navigate('Home', {
      screen: 'WorkoutStack',
      params: { screen: 'WorkoutStep', params: {} },
    })
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<WorkoutStep>) => {
    const isLast = index === workout.steps.length - 1
    return (
      <WorkoutStepCard
        step={item}
        onPress={() => onCardPress(item.guid)}
        containerStyle={{
          marginBottom: isLast ? 0 : undefined,
        }}
      />
    )
  }

  return (
    <IndicatedScrollList
      data={workout.steps.slice()}
      renderItem={renderItem}
      keyExtractor={item => `${workout!.date}_${item.guid}`}
      estimatedItemSize={140}
      contentContainerStyle={{
        paddingBottom: TabHeightCompensation + WorkoutBottomControlsHeight,
      }}
    />
  )
}
export default observer(WorkoutStepList)
