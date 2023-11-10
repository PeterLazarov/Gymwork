import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView, Dimensions } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'
import { Divider } from '../../designSystem'
import { SectionLabel } from '../../designSystem/Label'
import ExerciseHistoryChart from '../ExerciseHistory'

const padding = 16

const WorkoutExerciseHistory: React.FC = () => {
  const { workoutStore } = useStores()

  return (
    <View
      style={{
        padding,
        // margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
      }}
    >
      <ExerciseHistoryChart
        view="ALL"
        exerciseID={workoutStore.openedExercise.exercise.guid}
        height={250}
        width={Dimensions.get('window').width - padding * 2}
      />
      <ScrollView style={{ marginTop: -24 }}>
        {workoutStore.openedExerciseHistory.map(training => {
          return (
            <View
              style={{ gap: 8 }}
              key={training.date}
            >
              <SectionLabel>
                {DateTime.fromISO(training.date).toLocaleString(
                  DateTime.DATE_MED
                )}
              </SectionLabel>
              <Divider />
              {training.sets.map((set, i) => (
                <WorkoutExerciseSetListItem
                  key={i}
                  set={set}
                />
              ))}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseHistory)
