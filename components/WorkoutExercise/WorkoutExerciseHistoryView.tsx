import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'
import { Divider } from '../../designSystem'
import { SectionLabel } from '../../designSystem/Label'

const WorkoutExerciseHistory: React.FC = () => {
  const { workoutStore } = useStores()

  return (
    <View
      style={{
        padding: 16,
        // margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
      }}
    >
      <ScrollView>
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
