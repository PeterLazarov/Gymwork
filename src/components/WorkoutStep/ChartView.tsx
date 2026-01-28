import { CHART_VIEWS, CHART_VIEW_KEY } from "@/constants/chartViews"
import { useSetting } from "@/context/SettingContext"
import { useWorkoutsForExercise } from "@/db/hooks"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { ToggleGroupButton, spacing } from "@/designSystem"
import { useMemo } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { ExerciseStatsChart } from "./components/ExerciseStatsChart"

type ChartViewProps = {
  exercise: ExerciseModel
}

export const ChartView: React.FC<ChartViewProps> = ({ exercise }) => {
  const { chartHeight, chartView, chartWidth, setChartHeight, setChartView, setChartWidth } =
    useSetting()
  const { data: exerciseHistoryRaw, isLoading } = useWorkoutsForExercise(exercise.id!)

  const exerciseHistory = useMemo(
    () =>
      exerciseHistoryRaw ? exerciseHistoryRaw.map((workout) => new WorkoutModel(workout)) : [],
    [exerciseHistoryRaw],
  )

  const viewsArray = Object.keys(CHART_VIEWS) as CHART_VIEW_KEY[]
  const toggleViewButtons = viewsArray.map((view) => ({
    text: view,
    value: CHART_VIEWS[view],
  }))

  return (
    <View style={styles.screen}>
      <View
        style={styles.chartContainer}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout
          setChartHeight(height)
          setChartWidth(width)
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          chartHeight !== 0 && (
            <ExerciseStatsChart
              exerciseHistory={exerciseHistory}
              view={chartView}
              height={chartHeight}
              width={chartWidth}
              exercise={exercise}
            />
          )
        )}
      </View>

      <ToggleGroupButton
        buttons={toggleViewButtons}
        initialActiveIndex={viewsArray.indexOf(chartView)}
        containerStyle={{ padding: spacing.sm }}
        onChange={(value) => setChartView(value as CHART_VIEW_KEY)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    marginTop: spacing.md,
    justifyContent: "space-between",
    display: "flex",
    flexGrow: 1,
  },
  chartContainer: {
    alignItems: "center",
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
