import { MenuView, MenuComponentRef, MenuAction } from '@react-native-menu/menu'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useRef, useState } from 'react'
import { Menu } from 'react-native-paper'

import { useAppTheme } from '@/utils/useAppTheme'
import useBenchmark from '@/utils/useBenchmark'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { useShareWorkout } from 'app/utils/useShareWorkout'
import { Icon, IconButton } from 'designSystem'

import HomeMenuItems from '../HomeMenuItems'
import MiniTimer from '../MiniTimer'
import WorkoutTimerModal from '../Timer/WorkoutTimerModal'
import { Button, View } from 'react-native'

const WorkoutHeaderRight: React.FC = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  const menuRef = useRef<MenuComponentRef>(null)

  const {
    stateStore,
    settingsStore,
    workoutStore,
    navStore: { navigate, activeRoute },
    timerStore,
  } = useStores()
  const { openedWorkout } = stateStore
  const { showCommentsCard } = settingsStore
  const { performBenchmark } = useBenchmark()

  const [menuOpen, setMenuOpen] = useState(false)

  function openCalendar() {
    navigate('Calendar')
  }

  function saveTemplate() {
    setMenuOpen(false)
    navigate('SaveTemplate')
  }

  function toggleCommentsCard() {
    setMenuOpen(false)
    settingsStore.setProp('showCommentsCard', !showCommentsCard)
  }

  const deleteWorkout = () => {
    setMenuOpen(false)
    workoutStore.removeWorkout(openedWorkout!)
  }

  const menuActionsObj = useMemo(() => {
    return {
      toggleCommentsCard: {
        fn: toggleCommentsCard,
        title: translate(
          showCommentsCard ? 'hideCommentsCard' : 'showCommentsCard'
        ),
        showIf: true,
        state: showCommentsCard ? 'on' : 'off',
      },
      saveTemplate: {
        fn: saveTemplate,
        title: translate('saveAsTemplate'),
        showIf: Boolean(openedWorkout),
      },
      deleteWorkout: {
        fn: deleteWorkout,
        title: translate('removeWorkout'),
        showIf: Boolean(openedWorkout),
      },
      shareWorkout: {
        fn: shareWorkout,
        title: translate('shareWorkout'),
        showIf: Boolean(openedWorkout),
      },
      goToSettings: {
        fn() {
          navigate('Settings')
        },
        title: translate('settings'),
        showIf: true,
      },
      goToFeedback: {
        fn() {
          navigate('UserFeedback', { referrerPage: activeRoute ?? '?' })
        },
        title: translate('giveFeedback'),
        showIf: true,
      },
      performBenchmark: {
        fn: performBenchmark,
        title: translate('performBenchmark'),
        showIf: true,
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedWorkout])

  const menuActionsArray = useMemo((): MenuAction[] => {
    return Object.entries(menuActionsObj)
      .filter(([, { showIf }]) => showIf)
      .map(([id, obj]): MenuAction => {
        return {
          id,
          title: obj.title,
          titleColor: colors.onSurface,
          state: obj.state,
        }
      })
  }, [menuActionsObj])

  const shareWorkout = useShareWorkout()

  function handleMenuPress(actionID: keyof typeof menuActionsObj) {
    menuActionsObj[actionID].fn(openedWorkout!)
  }

  const [showWorkoutTimerModal, setShowWorkoutTimerModal] = useState(false)
  return (
    <>
      {settingsStore.showWorkoutTimer && (
        <>
          <MiniTimer
            n={Math.floor(timerStore.workoutTimer.timeElapsed.as('minutes'))}
            onPress={() => setShowWorkoutTimerModal(true)}
            color={colors.onSurface}
            backgroundColor={colors.surface}
          />

          <WorkoutTimerModal
            open={showWorkoutTimerModal}
            onClose={() => setShowWorkoutTimerModal(false)}
            timer={timerStore.workoutTimer}
          />
        </>
      )}

      <IconButton onPress={openCalendar}>
        <Icon
          icon="calendar-sharp"
          color={colors.onSurface}
        />
      </IconButton>

      <MenuView
        onPressAction={({ nativeEvent }) => {
          handleMenuPress(nativeEvent.event)
        }}
        actions={menuActionsArray}
        shouldOpenOnLongPress={false}
      >
        <IconButton
          onPress={() => {
            console.log('jknlk')
          }}
        >
          <Icon
            icon="ellipsis-vertical"
            color={colors.onSurface}
          />
        </IconButton>
      </MenuView>
    </>
  )
}

export default observer(WorkoutHeaderRight)
