import { useStores } from 'app/db/helpers/useStores'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import React, { useMemo, useState } from 'react'

import { Header, Icon, IconButton, colors } from 'designSystem'

import ExerciseSelectSimple from './ExerciseSelectSimple'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ExerciseChartStats from 'app/components/ExerciseStats/ExerciseChartStats'
import ExerciseHistoryStats from 'app/components/ExerciseStats/ExerciseHistoryStats'
import ExerciseRecordStats from 'app/components/ExerciseStats/ExerciseRecordStats'
import { View } from 'react-native'
import ExerciseRow from 'app/components/ExerciseRow'

export default function Review(props: {}) {
  const { stateStore } = useStores()
  const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)

  const Tab = createMaterialTopTabNavigator()

  const selectedExercise = useMemo(() => {
    return stateStore.reviewFocusedExercise ?? stateStore.focusedSet?.exercise
  }, [stateStore.reviewFocusedExercise, stateStore.focusedSet?.exercise])

  const rowOptions = useMemo(() => {
    return stateStore.focusedStep?.exercises?.includes(
      //   @ts-ignore
      stateStore.reviewFocusedExercise ?? stateStore.focusedSet?.exercise
    )
      ? stateStore.focusedStep?.exercises
      : []
  }, [selectedExercise, stateStore.focusedStep?.exercises])

  return (
    <EmptyLayout>
      <Header>
        <Header.Title title={selectedExercise?.name ?? 'Review'} />
        <IconButton
          onPress={() => setExerciseSelectOpen(true)}
          underlay="darker"
        >
          <Icon
            icon="dumbbell"
            color={colors.primaryText}
          />
        </IconButton>
      </Header>

      <View
        style={{
          flexGrow: 1,
          position: 'relative',
        }}
      >
        {exerciseSelectOpen && (
          <ExerciseSelectSimple
            multiselect={false}
            selected={[]}
            onChange={([e]) => {
              stateStore.setProp('reviewFocusedExerciseGuid', e?.guid)
              setExerciseSelectOpen(false)
            }}
          />
        )}

        {!exerciseSelectOpen && (
          <ExerciseRow
            selected={selectedExercise}
            onPress={() => {
              setExerciseSelectOpen(true)
            }}
            options={rowOptions}
          />
        )}

        {!exerciseSelectOpen && (
          <Tab.Navigator>
            <Tab.Screen name="Chart">
              {() => <ExerciseChartStats exercise={selectedExercise} />}
            </Tab.Screen>
            <Tab.Screen name="Records">
              {() => <ExerciseRecordStats exercise={selectedExercise} />}
            </Tab.Screen>
            <Tab.Screen name="History">
              {() => <ExerciseHistoryStats exercise={selectedExercise} />}
            </Tab.Screen>
          </Tab.Navigator>
        )}
      </View>
    </EmptyLayout>
  )
}
