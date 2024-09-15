import React, { useState } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { ToggleGroupButton } from 'designSystem'
import ExerciseHistoryChart, {
  CHART_VIEW,
  CHART_VIEWS,
  CHART_VIEW_KEY,
} from 'app/components/ExerciseHistoryChart'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'

export type ExerciseChartStats = {
  exercise?: Exercise
}

const ExerciseChartStats: React.FC<ExerciseChartStats> = ({ exercise }) => {
  const { stateStore } = useStores()
  const [activeView, setActiveView] = useState<CHART_VIEW>(
    Object.keys(CHART_VIEWS)[0] as CHART_VIEW_KEY
  )
  const [viewDimensions, setViewDimensions] = useState({ width: 0, height: 0 })

  const toggleViewButtons = (Object.keys(CHART_VIEWS) as CHART_VIEW_KEY[]).map(
    view => ({
      text: view,
      value: CHART_VIEWS[view],
    })
  )
  console.log('ExerciseChartStats')
  return (
    <View
      style={{
        marginTop: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexGrow: 1,
        }}
        onLayout={event => {
          const { width, height } = event.nativeEvent.layout
          setViewDimensions({ width, height })
        }}
      >
        <ExerciseHistoryChart
          view={activeView}
          height={viewDimensions.height}
          width={viewDimensions.width}
          exercise={exercise || stateStore.focusedExercise!}
        />
      </View>

      <ToggleGroupButton
        buttons={toggleViewButtons}
        initialActiveIndex={0}
        containerStyle={{ padding: 10 }}
        onChange={view => setActiveView(view as CHART_VIEW)}
      />
    </View>
  )
}

export default observer(ExerciseChartStats)
