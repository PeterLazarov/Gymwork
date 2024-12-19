import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Menu } from 'react-native-paper'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { formatDateIso } from 'app/utils/date'
import { useShareWorkout } from 'app/utils/useShareWorkout'
import { Header, Icon, IconButton } from 'designSystem'

import HomeMenuItems from '../HomeMenuItems'
import MiniTimer from '../MiniTimer'
import WorkoutTimerModal from '../Timer/WorkoutTimerModal'

const WorkoutHeader: React.FC = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    stateStore,
    settingsStore,
    workoutStore,
    navStore: { navigate },
    timerStore,
  } = useStores()
  const { openedWorkout } = stateStore
  const { showCommentsCard } = settingsStore

  const [menuOpen, setMenuOpen] = useState(false)

  const dateLabel = formatDateIso(stateStore.openedDate, 'long')

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

  const [showWorkoutTimerModal, setShowWorkoutTimerModal] = useState(false)
  const shareWorkout = useShareWorkout()
  return (
    <Header>
      <Header.Title title={dateLabel} />

      {settingsStore.showWorkoutTimer && (
        <>
          <MiniTimer
            n={Math.floor(timerStore.workoutTimer.timeElapsed.as('minutes'))}
            onPress={() => setShowWorkoutTimerModal(true)}
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
          color={colors.onPrimary}
        />
      </IconButton>

      <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        anchorPosition="bottom"
        anchor={
          <IconButton onPress={() => setMenuOpen(true)}>
            <Icon
              icon="ellipsis-vertical"
              color={colors.onPrimary}
            />
          </IconButton>
        }
      >
        {openedWorkout?.hasComments && (
          <Menu.Item
            onPress={toggleCommentsCard}
            title={translate(
              showCommentsCard ? 'hideCommentsCard' : 'showCommentsCard'
            )}
          />
        )}

        {openedWorkout && (
          <>
            <Menu.Item
              onPress={saveTemplate}
              title={translate('saveAsTemplate')}
            />
            <Menu.Item
              onPress={deleteWorkout}
              title={translate('removeWorkout')}
            />
            <Menu.Item
              onPress={() => {
                shareWorkout(openedWorkout)
              }}
              title={translate('shareWorkout')}
            />
          </>
        )}
        <HomeMenuItems onClose={() => setMenuOpen(false)} />
      </Menu>
    </Header>
  )
}

export default observer(WorkoutHeader)
