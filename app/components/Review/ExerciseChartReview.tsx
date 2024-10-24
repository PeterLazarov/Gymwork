import React from 'react'
import { View, StyleSheet } from 'react-native'
import { observer } from 'mobx-react-lite'

import { ToggleGroupButton } from 'designSystem'
import ExerciseHistoryChart, {
  CHART_VIEW,
  CHART_VIEWS,
  CHART_VIEW_KEY,
} from 'app/components/ExerciseHistoryChart'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'

export type ExerciseChartStatsProps = {
  exercise?: Exercise
}

const ExerciseChartStats: React.FC<ExerciseChartStatsProps> = ({
  exercise,
}) => {
  const { stateStore } = useStores()
  const viewsArray = Object.keys(CHART_VIEWS) as CHART_VIEW_KEY[]
  const toggleViewButtons = viewsArray.map(view => ({
    text: view,
    value: CHART_VIEWS[view],
  }))

  return (
    <View style={styles.screen}>
      <View
        style={styles.chartContainer}
        onLayout={event => {
          const { width, height } = event.nativeEvent.layout
          stateStore.setProp('chartHeight', height)
          stateStore.setProp('chartWidth', width)
        }}
      >
        {stateStore.chartHeight !== 0 && (
          <ExerciseHistoryChart
            view={stateStore.chartView}
            height={stateStore.chartHeight}
            width={stateStore.chartWidth}
            exercise={exercise || stateStore.focusedExercise!}
          />
        )}
      </View>

      <ToggleGroupButton
        buttons={toggleViewButtons}
        initialActiveIndex={viewsArray.indexOf(stateStore.chartView)}
        containerStyle={{ padding: 10 }}
        onChange={view => stateStore.setProp('chartView', view as CHART_VIEW)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    marginTop: 16,
    justifyContent: 'space-between',
    display: 'flex',
    flexGrow: 1,
  },
  chartContainer: {
    alignItems: 'center',
    flexGrow: 1,
  },
})

export default observer(ExerciseChartStats)
