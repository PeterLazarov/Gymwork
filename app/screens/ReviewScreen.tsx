import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  useAnimatedValue,
  View,
  ViewStyle,
} from 'react-native'
import PagerView from 'react-native-pager-view'

import {
  ExerciseSelectSheet,
  showExerciseSelect,
} from '@/components/Exercise/ExerciseSelectSheet'
import { Screen } from '@/components/ignite'
import { Exercise } from '@/db/models'
import { useAppTheme } from '@/utils/useAppTheme'
import ExerciseView from 'app/components/ExerciseHistoryChart/ExerciseView'
import ExerciseChartReview from 'app/components/Review/ExerciseChartReview'
import ExerciseHistoryReview from 'app/components/Review/ExerciseHistoryReview'
import ExerciseRecordReview from 'app/components/Review/ExerciseRecordReview'
import WorkoutsReview from 'app/components/Review/WorkoutsReview'
import { useStores } from 'app/db/helpers/useStores'
import { HeaderRight, IconButton, Icon } from 'designSystem'

export type ReviewScreenProps = StaticScreenProps<{
  exercise?: Exercise['guid']
}>

export const ReviewScreen: React.FC<ReviewScreenProps> = observer(
  ({ route: { params } }) => {
    const {
      theme: { colors },
    } = useAppTheme()

    const { stateStore, exerciseStore } = useStores()
    const exercise = params?.exercise

    const [selectedExercise, setSelectedExercise] = useState(
      exercise
        ? exerciseStore.exercisesMap[exercise]
        : stateStore.focusedExercise
    )

    useEffect(() => {
      if (stateStore.focusedExercise) {
        setSelectedExercise(stateStore.focusedExercise)
      }
    }, [stateStore.focusedExercise])

    const [segmentedControlIndex, setSegmentedControlIndex] = useState(0)
    const pagerRef = useRef<PagerView>(null)

    const windowWidth = Dimensions.get('window').width
    const numberOfTabs = 4
    const tabWidth = windowWidth / numberOfTabs
    const translateXValue = useAnimatedValue(0)

    const { navigate } = useNavigation()
    const handlePageScroll = useRef(true)

    function goToExerciseSelect() {
      showExerciseSelect()
        .then(exercises => {
          navigate('Home', {
            screen: 'ReviewStack',
            params: {
              screen: 'Review',
              params: { exercise: exercises[0].guid },
            },
          })
        })
        .catch()
    }

    return (
      <>
        {/* TODO figure out why it doesnt work */}
        <HeaderRight>
          <IconButton onPress={goToExerciseSelect}>
            <Icon
              icon="list-outline"
              color={colors.primary}
            />
          </IconButton>
        </HeaderRight>

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
            tabStyle={
              {
                // backgroundColor: 'blue',
              }
            }
            sliderStyle={{
              transform: [
                {
                  translateX: translateXValue.interpolate({
                    inputRange: [0, numberOfTabs - 1],
                    outputRange: [0, (numberOfTabs - 1) * tabWidth],
                  }),
                },
              ],
            }}
          />

          <PagerView
            style={{ flex: 1 }}
            initialPage={segmentedControlIndex}
            onPageSelected={page => {
              const i = page.nativeEvent.position
              setSegmentedControlIndex(i)
              console.log('onPageSelected', i)
            }}
            ref={pagerRef}
            onPageScroll={e => {
              if (handlePageScroll.current) {
                const { offset, position } = e.nativeEvent
                const scrollValue = position + offset
                translateXValue.setValue(scrollValue)
                // console.log('onPageScroll')
              }
            }}
            onPageScrollStateChanged={e => {
              console.log(e.nativeEvent.pageScrollState, translateXValue._value)
              switch (e.nativeEvent.pageScrollState) {
                case 'settling':
                  handlePageScroll.current = false
                  const didScrollForward = translateXValue._value > 0.5
                  Animated.spring(translateXValue, {
                    toValue: segmentedControlIndex + (didScrollForward ? 1 : 0),
                    useNativeDriver: true,
                  }).start()

                  break

                default:
                  handlePageScroll.current = true
              }
            }}
          >
            <View key="1">
              <WorkoutsReview />
            </View>
            <View
              key="2"
              style={{ flex: 1 }}
            >
              <ExerciseView
                openSelect={() => {
                  goToExerciseSelect()
                }}
                isExerciseSelected={!!selectedExercise}
              >
                <ExerciseChartReview exercise={selectedExercise} />
              </ExerciseView>
            </View>

            <View
              key="3"
              style={{ flex: 1 }}
            >
              <ExerciseView
                openSelect={() => {
                  goToExerciseSelect()
                }}
                isExerciseSelected={!!selectedExercise}
              >
                <ExerciseRecordReview exercise={selectedExercise} />
              </ExerciseView>
            </View>

            <View
              key="4"
              style={{ flex: 1 }}
            >
              <ExerciseView
                openSelect={() => goToExerciseSelect()}
                isExerciseSelected={!!selectedExercise}
              >
                <ExerciseHistoryReview exercise={selectedExercise} />
              </ExerciseView>
            </View>
          </PagerView>
        </Screen>

        <ExerciseSelectSheet />
      </>
    )
  }
)
