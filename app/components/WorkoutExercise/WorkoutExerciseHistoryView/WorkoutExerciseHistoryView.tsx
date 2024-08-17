import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Dimensions } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import WorkoutExerciseHistoryList from './WorkoutExerciseHistoryList'
import ExerciseHistoryChart from '../../ExerciseHistoryChart'

const padding = 16

type Props = {
  graphHidden: boolean
}
const WorkoutExerciseHistoryView: React.FC<Props> = ({ graphHidden }) => {
  const { workoutStore, stateStore } = useStores()

  const workoutsContained =
    workoutStore.exerciseWorkouts[stateStore.openedExerciseGuid]

  return (
    <View
      style={{
        margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
        display: 'flex',
        flexGrow: 1,
      }}
    >
      {workoutsContained?.length > 0 ? (
        <>
          {!graphHidden && (
            <ExerciseHistoryChart
              view="30D"
              exerciseID={stateStore.openedExerciseGuid}
              height={250}
              width={Dimensions.get('window').width}
            />
          )}
          <WorkoutExerciseHistoryList workouts={workoutsContained} />
        </>
      ) : (
        <EmptyState text={translate('historyLogEmpty')} />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
