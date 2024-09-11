import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Menu } from 'react-native-paper'
import { getSnapshot } from 'mobx-state-tree'
import { DateTime } from 'luxon'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { useExport } from 'app/utils/useExport'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, colors } from 'designSystem'
import useBenchmark from 'app/utils/useBenchmark'

import WorkoutTimer from '../Timer/WorkoutTimer'

const WorkoutHeader: React.FC = () => {
  const { stateStore, workoutStore } = useStores()

  const { openedWorkout, showCommentsCard } = stateStore
  const [menuOpen, setMenuOpen] = useState(false)
  const { exportWorkouts, restoreWorkouts } = useExport()

  // TODO dedupe with DayControl
  const date = DateTime.fromISO(stateStore.openedDate)
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(date.diff(today, 'days').days)
  const dateLabel =
    Math.abs(todayDiff) < 2
      ? date.toRelativeCalendar({ unit: 'days' })!
      : date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  function openCalendar() {
    navigate('Calendar')
  }

  function saveTemplate() {
    setMenuOpen(false)
    navigate('SaveTemplate')
  }

  function toggleCommentsCard() {
    setMenuOpen(false)
    stateStore.setProp('showCommentsCard', !showCommentsCard)
  }

  const exportData = () => {
    setMenuOpen(false)

    exportWorkouts(getSnapshot(workoutStore))
  }

  const restoreData = async () => {
    setMenuOpen(false)

    const result = await restoreWorkouts()
    workoutStore.setProp('workouts', result?.workouts)
    workoutStore.setProp('workoutTemplates', result?.workoutTemplates)
  }

  const deleteWorkout = () => {
    setMenuOpen(false)
    workoutStore.removeWorkout(openedWorkout!)
  }

  const { performBenchmark } = useBenchmark()

  return (
    <Header>
      <Header.Title title={dateLabel} />
      <WorkoutTimer style={{ color: colors.primaryText }} />

      <IconButton
        onPress={openCalendar}
        underlay="darker"
      >
        <Icon
          icon="calendar-sharp"
          color={colors.primaryText}
        />
      </IconButton>

      <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        anchorPosition="bottom"
        anchor={
          <IconButton
            onPress={() => setMenuOpen(true)}
            underlay="darker"
          >
            <Icon
              icon="ellipsis-vertical"
              color={colors.primaryText}
            />
          </IconButton>
        }
      >
        <Menu.Item
          onPress={saveTemplate}
          title={translate('saveAsTemplate')}
        />
        {openedWorkout?.hasComments && (
          <Menu.Item
            onPress={toggleCommentsCard}
            title={translate(
              showCommentsCard ? 'hideCommentsCard' : 'showCommentsCard'
            )}
          />
        )}
        <Menu.Item
          onPress={exportData}
          title={translate('exportData')}
        />
        <Menu.Item
          onPress={restoreData}
          title={translate('restoreData')}
        />
        <Menu.Item
          onPress={deleteWorkout}
          title={translate('removeWorkout')}
        />
        <Menu.Item
          onPress={performBenchmark}
          title="Perform benchmark"
        />
      </Menu>
    </Header>
  )
}

export default observer(WorkoutHeader)
