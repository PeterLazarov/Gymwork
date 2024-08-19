import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View, Dimensions } from 'react-native'

import { ToggleGroupButton } from 'designSystem'
import ExerciseHistoryChart, {
  CHART_VIEW,
  CHART_VIEWS,
  CHART_VIEW_KEY,
} from 'app/components/ExerciseHistoryChart'

const WorkoutExerciseChartView: React.FC = () => {
  const [activeView, setActiveView] = useState<CHART_VIEW>(
    Object.keys(CHART_VIEWS)[0] as CHART_VIEW_KEY
  )

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
      <ExerciseHistoryChart
        view={activeView}
        height={250}
        width={Dimensions.get('window').width}
      />

      <ToggleGroupButton
        buttons={toggleViewButtons}
        initialActiveIndex={0}
      />
    </View>
  )
}

export default observer(WorkoutExerciseChartView)
