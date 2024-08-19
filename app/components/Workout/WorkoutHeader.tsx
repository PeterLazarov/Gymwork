import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Menu } from 'react-native-paper'

import WorkoutHeaderTimerButtons from '../Timer/TimerButtons'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { useShare } from 'app/utils/useShare'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, colors } from 'designSystem'

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
    <Header>
      <Header.Title title="Gymwork" />

      {stateStore.isOpenedWorkoutToday && <WorkoutHeaderTimerButtons />}
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
          onPress={exportData}
          title={translate('exportData')}
        />
      </Menu>
    </Header>
  )
}

export default observer(WorkoutHeader)
