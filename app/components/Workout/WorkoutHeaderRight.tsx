import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { MenuAction } from '@react-native-menu/menu'
import { useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useRef, useState } from 'react'
import { Platform } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import useBenchmark from '@/utils/useBenchmark'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { useShareWorkout } from 'app/utils/useShareWorkout'
import { Icon, IconButton, MenuViewWrapped } from 'designSystem'

import MiniTimer from '../MiniTimer'
import WorkoutTimerSettings from '../Timer/WorkoutTimerSettings'

const WorkoutHeaderRight: React.FC = () => {
  const { theme } = useAppTheme()

  const { stateStore, settingsStore, workoutStore, timerStore } = useStores()
  const { openedWorkout } = stateStore
  const { showCommentsCard } = settingsStore
  const { performBenchmark } = useBenchmark()

  const { navigate } = useNavigation()

  function openCalendar() {
    navigate('Calendar', {})
  }

  function saveTemplate() {
    navigate('Home', {
      screen: 'WorkoutStack',
      params: { screen: 'SaveTemplate', params: {} },
    })
  }

  function toggleCommentsCard() {
    settingsStore.setProp('showCommentsCard', !showCommentsCard)
  }

  const deleteWorkout = () => {
    workoutStore.removeWorkout(openedWorkout!)
  }

  const shareWorkout = useShareWorkout()

  const menuActions = useMemo(() => {
    const actions = [
      {
        title: translate('showCommentsCard'),
        fn: toggleCommentsCard,
        state: showCommentsCard ? 'on' : 'off',
      },
      {
        title: translate('saveAsTemplate'),
        fn: saveTemplate,
        showIf: Boolean(openedWorkout),
      },
      {
        title: translate('removeWorkout'),
        fn: deleteWorkout,
        showIf: Boolean(openedWorkout),
      },
      {
        title: translate('shareWorkout'),
        fn: shareWorkout,
        showIf: Boolean(openedWorkout),
      },
      {
        title: translate('settings'),
        fn: () => navigate('Settings', {}),
      },
      {
        title: translate('giveFeedback'),
        fn: () => navigate('UserFeedback', { referrerPage: 'Workout' }),
      },
      {
        title: translate('performBenchmark'),
        fn: performBenchmark,
      },
    ]

    return actions
      .filter(action => action.showIf !== false)
      .map(({ showIf, ...action }) => ({
        ...action,
        titleColor: theme.colors.onSurface,
      }))
  }, [openedWorkout, showCommentsCard, theme.colors.onSurface])

  const timerSettingsSheetRef = useRef<TrueSheet>(null)
  return (
    <>
      {settingsStore.showWorkoutTimer && (
        <>
          <MiniTimer
            n={Math.floor(timerStore.workoutTimer.timeElapsed.as('minutes'))}
            onPress={() => timerSettingsSheetRef.current?.present()}
            color={theme.colors.onSurface}
            backgroundColor={theme.colors.surface}
          />
        </>
      )}

      <IconButton onPress={openCalendar}>
        <Icon
          icon="calendar-sharp"
          color={theme.colors.onSurface}
        />
      </IconButton>

      <MenuViewWrapped
        actions={menuActions}
        shouldOpenOnLongPress={false}
      >
        <IconButton>
          <Icon
            icon="ellipsis-vertical"
            color={theme.colors.onSurface}
          />
        </IconButton>
      </MenuViewWrapped>

      <TrueSheet
        ref={timerSettingsSheetRef}
        sizes={['medium']}
        backgroundColor={theme.colors.surfaceContainer}
        contentContainerStyle={{
          paddingTop: theme.spacing.md,
          paddingBottom: Platform.select({
            ios: theme.spacing.md,
            android: 0,
          }),
        }}
      >
        <WorkoutTimerSettings timer={timerStore.workoutTimer} />
      </TrueSheet>
    </>
  )
}

export default observer(WorkoutHeaderRight)
