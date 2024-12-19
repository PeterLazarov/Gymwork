import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { Menu } from 'react-native-paper'

import { useAppTheme } from '@/utils/useAppTheme'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton } from 'designSystem'

export type StepHeaderProps = {
  step: WorkoutStep
  onSwitchExercise: () => void
}

const StepHeader: React.FC<StepHeaderProps> = ({ step, onSwitchExercise }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    stateStore,
    navStore: { navigate, activeRoute },
  } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)
  const { showSnackbar } = useDialogContext()

  const deleteSelectedExercises = () => {
    const undoDelete = stateStore.deleteFocusedStep()
    navigate('WorkoutStack', { screen: 'Workout' })
    showSnackbar!({
      text: 'Exercise was removed from workout',
      actionText: 'Undo',
      action: undoDelete,
    })
  }

  const toggleFavoriteExercise = () => {
    setMenuOpen(false)
    const exercise = stateStore.focusedExercise!
    exercise.setProp('isFavorite', !exercise.isFavorite)
  }

  function onSwitchExercisePress() {
    setMenuOpen(false)
    onSwitchExercise()
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit', {})
  }
  function goToFeedback() {
    setMenuOpen(false)
    navigate('UserFeedback', { referrerPage: activeRoute ?? '?' })
  }

  function goBack() {
    stateStore.setProp('focusedStepGuid', '')
    navigate('WorkoutStack', { screen: 'Workout' })
  }

  const focusedStepName = useMemo(() => {
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
      <IconButton onPress={goBack}>
        <Icon
          color={colors.onPrimary}
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
            <IconButton onPress={() => setMenuOpen(true)}>
              <Icon
                icon="ellipsis-vertical"
                color={colors.onPrimary}
              />
            </IconButton>
          }
        >
          <Menu.Item
            onPress={onSwitchExercisePress}
            title={translate('switchExercise')}
          />
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

          <Menu.Item
            onPress={goToFeedback}
            title={translate('giveFeedback')}
          />
        </Menu>
      )}
    </Header>
  )
}

export default observer(StepHeader)
