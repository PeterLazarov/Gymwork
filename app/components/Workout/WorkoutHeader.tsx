import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Menu } from 'react-native-paper'
import { DateTime } from 'luxon'
import { capitalize } from 'lodash'

import { useStores } from 'app/db/helpers/useStores'
import { useExport } from 'app/utils/useExport'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, useColors } from 'designSystem'
import useBenchmark from 'app/utils/useBenchmark'
import { useDialogContext } from 'app/contexts/DialogContext'
import HeaderMenuItems from '../HeaderMenuItems'

const WorkoutHeader: React.FC = () => {
  const colors = useColors()

  const {
    stateStore,
    workoutStore,
    navStore: { navigate },
  } = useStores()
  const { openedWorkout, showCommentsCard } = stateStore

  const [menuOpen, setMenuOpen] = useState(false)

  // TODO dedupe with DayControl
  const date = DateTime.fromISO(stateStore.openedDate)
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(date.diff(today, 'days').days)
  const dateLabel =
    Math.abs(todayDiff) < 2
      ? capitalize(date.toRelativeCalendar({ unit: 'days' })!)
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

  const deleteWorkout = () => {
    setMenuOpen(false)
    workoutStore.removeWorkout(openedWorkout!)
  }

  const { performBenchmark } = useBenchmark()

  return (
    <Header>
      <Header.Title title={dateLabel} />
      {/* <WorkoutTimer style={{ color: colors.onPrimary }} /> */}

      <IconButton
        onPress={openCalendar}
        underlay="darker"
      >
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
          <IconButton
            onPress={() => setMenuOpen(true)}
            underlay="darker"
          >
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
          </>
        )}
        <HeaderMenuItems onClose={() => setMenuOpen(false)} />
      </Menu>
    </Header>
  )
}

export default observer(WorkoutHeader)
