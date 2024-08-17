import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Appbar, Menu } from 'react-native-paper'

import WorkoutHeaderTimerButtons from '../Timer/TimerButtons'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { useShare } from 'app/utils/useShare'
import { translate } from 'app/i18n'
import { Icon, colors } from 'designSystem'

const WorkoutHeader: React.FC = () => {
  const { stateStore } = useStores()
  const { workoutStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)

  const share = useShare()

  function openCalendar() {
    navigate('Calendar')
  }

  const exportData = () => {
    setMenuOpen(false)
    share(workoutStore)
  }

  return (
    <Appbar.Header style={{ backgroundColor: colors.primary }}>
      <Appbar.Content
        title="Gymwork"
        style={{ alignItems: 'flex-start' }}
        titleStyle={{ color: colors.primaryText }}
      />

      {stateStore.isOpenedWorkoutToday && <WorkoutHeaderTimerButtons />}
      <Appbar.Action
        icon={() => (
          <Icon
            icon="calendar-sharp"
            color={colors.primaryText}
          />
        )}
        onPress={openCalendar}
        animated={false}
      />

      <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        anchorPosition="bottom"
        anchor={
          <Appbar.Action
            icon={() => (
              <Icon
                icon="ellipsis-vertical"
                color={colors.primaryText}
              />
            )}
            onPress={() => setMenuOpen(true)}
            animated={false}
          />
        }
      >
        <Menu.Item
          onPress={exportData}
          title={translate('exportData')}
        />
      </Menu>
    </Appbar.Header>
  )
}

export default observer(WorkoutHeader)
