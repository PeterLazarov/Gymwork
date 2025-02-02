import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { Menu } from 'react-native-paper'

import { Screen } from '@/components/ignite'
import { useAppTheme } from '@/utils/useAppTheme'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import ExerciseView from 'app/components/ExerciseHistoryChart/ExerciseView'
import HomeMenuItems from 'app/components/HomeMenuItems'
import MenuContainer from 'app/components/MenuContainer'
import ExerciseChartReview from 'app/components/Review/ExerciseChartReview'
import ExerciseHistoryReview from 'app/components/Review/ExerciseHistoryReview'
import ExerciseRecordReview from 'app/components/Review/ExerciseRecordReview'
import WorkoutsReview from 'app/components/Review/WorkoutsReview'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import {
  Header,
  Icon,
  IconButton,
  TabConfig,
  TopNavigation,
} from 'designSystem'

export const ReviewScreen: React.FC = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()

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

  const tabsConfig: TabConfig[] = useMemo(
    () => [
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
    ],
    [selectedExercise]
  )

  function onBack() {
    if (exerciseSelectOpen) {
      setExerciseSelectOpen(false)
    } else {
      navStore.goBack()
    }
  }

  // Changing this on the fly causes issues with the tabs
  const initialRouteName = useRef(navStore.reviewLastTab || 'Records')

  return (
    <>
      <Header>
        {exerciseSelectOpen && (
          <IconButton onPress={onBack}>
            <Icon
              color={colors.onPrimary}
              icon="chevron-back"
            />
          </IconButton>
        )}

        <Header.Title
          title={
            exerciseSelectOpen
              ? translate('selectExercise')
              : (selectedExercise?.name ?? 'Review')
          }
        />

        <IconButton onPress={() => setExerciseSelectOpen(true)}>
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
                <IconButton onPress={() => setMenuVisible(true)}>
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

      <Screen
        safeAreaEdges={['top']}
        contentContainerStyle={{
          flexGrow: 1,
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
            initialRouteName={initialRouteName.current}
            tabWidth={Dimensions.get('screen').width / 3.5}
            onTabChange={tab => {
              navStore.setProp('reviewLastTab', tab)
            }}
          />
        )}
      </Screen>
    </>
  )
})
