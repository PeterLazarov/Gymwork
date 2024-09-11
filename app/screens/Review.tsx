import React, { useMemo, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View } from 'react-native'

import { Header, Icon, IconButton, colors } from 'designSystem'

import { useStores } from 'app/db/helpers/useStores'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import ExerciseChartStats from 'app/components/ExerciseStats/ExerciseChartStats'
import ExerciseHistoryStats from 'app/components/ExerciseStats/ExerciseHistoryStats'
import ExerciseRecordStats from 'app/components/ExerciseStats/ExerciseRecordStats'
import ExerciseRow from 'app/components/ExerciseRow'
import EmptyState from 'app/components/EmptyState'

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
          <ExerciseSelectLists
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

        {!exerciseSelectOpen && selectedExercise && (
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

        {!exerciseSelectOpen && !selectedExercise && (
          <EmptyState text="Select an exercise to view data" />
        )}
      </View>
    </EmptyLayout>
  )
}
