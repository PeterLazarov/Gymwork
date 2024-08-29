import React, { useState } from 'react'
import { View } from 'react-native'
import { Menu } from 'react-native-paper'

import WorkoutExerciseTrackView from 'app/components/WorkoutExercise/WorkoutExerciseTrackView'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, colors } from 'designSystem'

const WorkoutStepPage: React.FC = () => {
  const { stateStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)

  function onBackPress() {
    navigate('Workout')
    stateStore.setOpenedStep(null)
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

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
        <Header.Title title={stateStore.openedStep?.exercise.name || ''} />

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

      <WorkoutExerciseTrackView />
    </View>
  )
}

export default WorkoutStepPage
