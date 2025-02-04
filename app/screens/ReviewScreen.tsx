import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import PagerView from 'react-native-pager-view'
import { View } from 'react-native'

import { Screen } from '@/components/ignite'
import { useAppTheme } from '@/utils/useAppTheme'
import ExerciseView from 'app/components/ExerciseHistoryChart/ExerciseView'
import ExerciseChartReview from 'app/components/Review/ExerciseChartReview'
import ExerciseHistoryReview from 'app/components/Review/ExerciseHistoryReview'
import ExerciseRecordReview from 'app/components/Review/ExerciseRecordReview'
import WorkoutsReview from 'app/components/Review/WorkoutsReview'
import { useStores } from 'app/db/helpers/useStores'
import { useRouteParams } from '@/navigators'
import { Exercise } from '@/db/models'
import { Header, IconButton, Icon } from 'designSystem'

export type ReviewScreenParams = {
  exercise?: Exercise['guid']
  // tab?: number
}

export const ReviewScreen: React.FC = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()

  const { stateStore, navStore, exerciseStore } = useStores()
  const { exercise } = useRouteParams('Review')

  const [selectedExercise, setSelectedExercise] = useState(
    exercise ? exerciseStore.exercisesMap[exercise] : stateStore.focusedExercise
  )

  useEffect(() => {
    if (stateStore.focusedExercise) {
      setSelectedExercise(stateStore.focusedExercise)
    }
  }, [stateStore.focusedExercise])

  // Changing this on the fly causes issues with the tabs
  // const initialRouteName = useRef(navStore.reviewLastTab || 'Records')

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0)
  const pagerRef = useRef<PagerView>(null)

  function goToExerciseSelect() {
    navStore.navigate('ExerciseSelect', {
      selectMode: 'straightSet',
      onSelect(exercises) {
        // TODO fix type to allow this
        navStore.navigate('HomeStack', {
          screen: 'Review',
          params: {
            exercise: exercises[0].guid,
          },
        })
      },
    })
  }

  return (
    <>
      {/* TODO figure out why it doesnt work */}
      <Header>
        <IconButton onPress={goToExerciseSelect}>
          <Icon
            icon="list-outline"
            color={colors.primary}
          />
        </IconButton>
      </Header>

      <Screen
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.surface,
        }}
      >
        <SegmentedControl
          values={['Workout', 'Chart', 'Records', 'History']}
          selectedIndex={segmentedControlIndex}
          onChange={event => {
            const i = event.nativeEvent.selectedSegmentIndex
            pagerRef.current?.setPage(i)
            setSegmentedControlIndex(i)
          }}
        />

        <PagerView
          style={{ flex: 1 }}
          initialPage={segmentedControlIndex}
          onPageSelected={page => {
            setSegmentedControlIndex(page.nativeEvent.position)
          }}
          ref={pagerRef}
        >
          <View key="1">
            <WorkoutsReview />
          </View>
          <View key="2">
            <ExerciseView
              openSelect={() => {
                goToExerciseSelect()
              }}
              isExerciseSelected={!!selectedExercise}
            >
              <ExerciseChartReview exercise={selectedExercise} />
            </ExerciseView>
          </View>

          <View key="3">
            <ExerciseView
              openSelect={() => {
                goToExerciseSelect()
              }}
              isExerciseSelected={!!selectedExercise}
            >
              <ExerciseRecordReview exercise={selectedExercise} />
            </ExerciseView>
          </View>

          <View key="4">
            <ExerciseView
              openSelect={() => goToExerciseSelect()}
              isExerciseSelected={!!selectedExercise}
            >
              <ExerciseHistoryReview exercise={selectedExercise} />
            </ExerciseView>
          </View>
        </PagerView>
      </Screen>
    </>
  )
})
