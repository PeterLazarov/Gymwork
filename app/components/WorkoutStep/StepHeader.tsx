import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { Menu } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, useColors } from 'designSystem'
import { useDialogContext } from 'app/contexts/DialogContext'

const StepHeader: React.FC = () => {
  const colors = useColors()

  const { stateStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)
  const { showSnackbar } = useDialogContext()

  const deleteSelectedExercises = () => {
    // stateStore.deleteFocusedStep()
    navigate('Workout')
    showSnackbar!({
      text: 'Exercise was removed from workout',
      actionText: 'Undo',
      action: () => console.log('do the thing'),
    })
  }

  const toggleFavoriteExercise = () => {
    setMenuOpen(false)
    const exercise = stateStore.focusedExercise!
    exercise.setProp('isFavorite', !exercise.isFavorite)
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

  function goBack() {
    stateStore.setProp('focusedStepGuid', '')
    navigate('Workout')
  }

  const focusedStepName = useMemo(() => {
    const step = stateStore.focusedStep!
    const workout = stateStore.openedWorkout!

    const name = step.type === 'straightSet' ? step.exercise!.name : 'Superset'
    let similarSteps = workout.steps.filter(s => s.type === step.type)

    if (step.type === 'straightSet') {
      similarSteps = similarSteps.filter(s =>
        s.exercises.includes(stateStore.focusedExercise!)
      )
    }

    const n = similarSteps.indexOf(step) + 1

    return `${name} ${similarSteps.length > 1 ? n : ''}`
  }, [stateStore.focusedStep!.exercise])

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
        title={focusedStepName}
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
            title={translate('removeFromWorkout')}
          />
          <Menu.Item
            onPress={toggleFavoriteExercise}
            title={translate(
              stateStore.focusedExercise!.isFavorite
                ? 'removeFavorite'
                : 'setAsFavorite'
            )}
          />
        </Menu>
      )}
    </Header>
  )
}

export default observer(StepHeader)
