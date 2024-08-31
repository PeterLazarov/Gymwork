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
    stateStore.deleteSelectedExercises()
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

  return (
    <Header>
      <Header.Title
        title={stateStore.focusedStep?.exercise.name || 'Gymwork'}
      />

      {stateStore.focusedStepGuid && (
        <IconButton
          onPress={deleteSelectedExercises}
          underlay="darker"
        >
          <Icon
            icon="delete"
            color={colors.primaryText}
          />
        </IconButton>
      )}
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
  )
}

export default observer(StepHeader)
