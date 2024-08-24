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
        }}
      >
        <ExerciseHistoryChart
          view={activeView}
          height={Dimensions.get('window').height - 192}
          width={Dimensions.get('window').width - 32}
        />
      </View>

      <ToggleGroupButton
        buttons={toggleViewButtons}
        initialActiveIndex={0}
      />
    </View>
  )
}

export default observer(WorkoutExerciseChartView)
