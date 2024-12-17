import React, { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { Menu } from 'react-native-paper'

import {
  Header,
  Icon,
  IconButton,
  TopNavigation,
  TabConfig,
  useColors,
} from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import ExerciseChartReview from 'app/components/Review/ExerciseChartReview'
import ExerciseHistoryReview from 'app/components/Review/ExerciseHistoryReview'
import ExerciseRecordReview from 'app/components/Review/ExerciseRecordReview'
import { translate } from 'app/i18n'
import ExerciseView from 'app/components/ExerciseHistoryChart/ExerciseView'
import HomeMenuItems from 'app/components/HomeMenuItems'
import WorkoutsReview from 'app/components/Review/WorkoutsReview'
import MenuContainer from 'app/components/MenuContainer'

export const ReviewScreen: React.FC = () => {
  const colors = useColors()

  const { stateStore, navStore } = useStores()
  const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(
    stateStore.focusedExercise
  )

  useEffect(() => {
    if (stateStore.focusedExercise) {
      setSelectedExercise(stateStore.focusedExercise)
    }
  }, [stateStore.focusedExercise])

  const tabsConfig: TabConfig[] = [
    {
      name: 'Workouts',
      Component: WorkoutsReview,
    },
    {
      name: 'Chart',
      Component: () => (
        <ExerciseView
          openSelect={() => setExerciseSelectOpen(true)}
          isExerciseSelected={!!selectedExercise}
        >
          <ExerciseChartReview exercise={selectedExercise} />
        </ExerciseView>
      ),
    },
    {
      name: 'Records',
      Component: () => (
        <ExerciseView
          openSelect={() => setExerciseSelectOpen(true)}
          isExerciseSelected={!!selectedExercise}
        >
          <ExerciseRecordReview exercise={selectedExercise} />
        </ExerciseView>
      ),
    },
    {
      name: 'History',
      Component: () => (
        <ExerciseView
          openSelect={() => setExerciseSelectOpen(true)}
          isExerciseSelected={!!selectedExercise}
        >
          <ExerciseHistoryReview exercise={selectedExercise} />
        </ExerciseView>
      ),
    },
  ]

  function onBack() {
    if (exerciseSelectOpen) {
      setExerciseSelectOpen(false)
    } else {
      navStore.goBack()
    }
  }

  return (
    <>
      <Header>
        <IconButton
          onPress={onBack}
          underlay="darker"
        >
          <Icon
            color={colors.onPrimary}
            icon="chevron-back"
          />
        </IconButton>

        <Header.Title
          title={
            exerciseSelectOpen
              ? translate('selectExercise')
              : selectedExercise?.name ?? 'Review'
          }
        />

        <IconButton
          onPress={() => setExerciseSelectOpen(true)}
          underlay="darker"
        >
          <Icon
            icon="list-outline"
            color={colors.onPrimary}
          />
        </IconButton>

        <MenuContainer>
          {([menuVisible, setMenuVisible]) => (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchorPosition="bottom"
              anchor={
                <IconButton
                  onPress={() => setMenuVisible(true)}
                  underlay="darker"
                >
                  <Icon
                    icon="ellipsis-vertical"
                    color={colors.onPrimary}
                  />
                </IconButton>
              }
            >
              <HomeMenuItems onClose={() => setMenuVisible(false)} />
            </Menu>
          )}
        </MenuContainer>
      </Header>

      <View
        style={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: colors.surface,
        }}
      >
        {exerciseSelectOpen && (
          <ExerciseSelectLists
            multiselect={false}
            selected={[]}
            onChange={([e]) => {
              if (e) {
                setSelectedExercise(e)
              }
              setExerciseSelectOpen(false)
            }}
          />
        )}

        {!exerciseSelectOpen && (
          <TopNavigation
            tabsConfig={tabsConfig}
            initialRouteName={navStore.reviewLastTab || 'Records'}
            tabWidth={Dimensions.get('screen').width / 3.5}
            onTabChange={tab => {
              navStore.setProp('reviewLastTab', tab)
            }}
          />
        )}
      </View>
    </>
  )
}
