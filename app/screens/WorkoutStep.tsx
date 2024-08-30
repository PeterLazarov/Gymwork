import React, { useState } from 'react'
import { View } from 'react-native'
import { Menu } from 'react-native-paper'

import TrackView from 'app/components/WorkoutExercise/TrackView'
import ExerciseHistoryStats from 'app/components/ExerciseStats/ExerciseHistoryStats'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, SwipeTabs, colors } from 'designSystem'

const WorkoutStepScreen: React.FC = () => {
  const { stateStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)

  function onBackPress() {
    navigate('Workout')
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

  const tabs = [
    {
      label: translate('track'),
      name: 'track',
      component: TrackView,
    },
    {
      label: translate('history'),
      name: 'history',
      component: () => (
        <ExerciseHistoryStats exercise={stateStore.focusedStep!.exercise} />
      ),
    },
  ]

  return (
    <View
      style={{
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        backgroundColor: colors.secondary,
      }}
    >
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.primaryText}
          />
        </IconButton>
        <Header.Title title={stateStore.focusedStep?.exercise.name || ''} />

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
            onPress={onEditExercisePress}
            title={translate('editExercise')}
          />
        </Menu>
      </Header>

      <SwipeTabs tabsConfig={tabs} />
    </View>
  )
}

export default WorkoutStepScreen
