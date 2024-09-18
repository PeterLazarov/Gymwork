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

const WorkoutHeader: React.FC = () => {
  const colors = useColors()

  const {
    stateStore,
    workoutStore,
    navStore: { navigate },
  } = useStores()
  const { openedWorkout, showCommentsCard } = stateStore

  const [menuOpen, setMenuOpen] = useState(false)
  const { exportData, restoreData } = useExport()
  const { showSnackbar } = useDialogContext()

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

  const onExportData = () => {
    setMenuOpen(false)

    exportData().then(() => {
      showSnackbar!({
        text: translate('dataExportSuccess'),
      })
    })
  }

  const onRestoreData = async () => {
    setMenuOpen(false)

    restoreData().then(() => {
      showSnackbar!({
        text: translate('dataImportSuccess'),
      })
    })
  }

  const deleteWorkout = () => {
    setMenuOpen(false)
    workoutStore.removeWorkout(openedWorkout!)
  }

  const { performBenchmark } = useBenchmark()

  function goToSettings() {
    setMenuOpen(false)
    navigate('Settings')
  }

  return (
    <Header>
      <Header.Title title={dateLabel} />
      {/* <WorkoutTimer style={{ color: colors.mat.onPrimary }} /> */}

      <IconButton
        onPress={openCalendar}
        underlay="darker"
      >
        <Icon
          icon="calendar-sharp"
          color={colors.mat.onPrimary}
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
              color={colors.mat.onPrimary}
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
        <Menu.Item
          onPress={goToSettings}
          title={translate('settings')}
        />
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
        <Menu.Item
          onPress={onExportData}
          title={translate('exportData')}
        />
        <Menu.Item
          onPress={onRestoreData}
          title={translate('restoreData')}
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
