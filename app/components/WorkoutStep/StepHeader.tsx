import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Menu } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, colors } from 'designSystem'

const StepHeader: React.FC = () => {
  const { stateStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)

  const deleteSelectedExercises = () => {
    stateStore.openedWorkout!.removeStep(stateStore.focusedStep!)
    stateStore.setFocusedStep('')
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

  function goBack() {
    stateStore.setProp('focusedStepGuid', '')
  }

  return (
    <Header>
      <IconButton
        onPress={goBack}
        underlay="darker"
      >
        <Icon
          color={colors.primaryText}
          icon="chevron-back"
        />
      </IconButton>
      <Header.Title
        title={stateStore.focusedStep?.name || 'Gymwork'}
        numberOfLines={1}
      />

      {stateStore.focusedStepGuid && (
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
          <Menu.Item
            onPress={deleteSelectedExercises}
            title={translate('removeExercise')}
          />
        </Menu>
      )}
    </Header>
  )
}

export default observer(StepHeader)
