import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View, Dimensions } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { ToggleGroupButton } from 'designSystem'
import ExerciseHistoryChart, {
  CHART_VIEW,
  CHART_VIEWS,
  CHART_VIEW_KEY,
} from 'app/components/ExerciseHistoryChart'
import WorkoutExerciseHistoryList from './WorkoutExerciseHistoryList'

type Props = {
  graphHidden: boolean
}
const WorkoutExerciseHistoryView: React.FC<Props> = ({ graphHidden }) => {
  const { workoutStore, stateStore } = useStores()

  const [activeView, setActiveView] = useState<CHART_VIEW>(
    Object.keys(CHART_VIEWS)[0] as CHART_VIEW_KEY
  )

  const workoutsContained =
    workoutStore.exerciseWorkouts[stateStore.openedExerciseGuid]

  const toggleViewButtons = (Object.keys(CHART_VIEWS) as CHART_VIEW_KEY[]).map(
    view => ({
      text: view,
      onPress: () => setActiveView(CHART_VIEWS[view]),
    })
  )

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
            <>
              <ExerciseHistoryChart
                view={activeView}
                exerciseID={stateStore.openedExerciseGuid}
                height={250}
                width={Dimensions.get('window').width}
              />

              <ToggleGroupButton
                buttons={toggleViewButtons}
                initialActiveIndex={0}
              />
            </>
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
