import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { Menu } from 'react-native-paper'

import { useAppTheme } from '@/utils/useAppTheme'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { HeaderRight, HeaderTitle, Icon, IconButton } from 'designSystem'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { MenuViewWrapped } from 'designSystem/components/MenuViewWrapped'

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
    <>
      <HeaderTitle
        title={focusedStepName}
        numberOfLines={1}
      />

      <HeaderRight>
        {stateStore.focusedStepGuid && (
          <MenuViewWrapped
            actions={[
              { title: translate('switchExercise'), fn: onSwitchExercisePress },
              { title: translate('editExercise'), fn: onEditExercisePress },
              {
                title: translate('removeFromWorkout'),
                fn: deleteSelectedExercises,
              },
              {
                title: translate(
                  stateStore.focusedExercise!.isFavorite
                    ? 'removeFavorite'
                    : 'setAsFavorite'
                ),
                fn: toggleFavoriteExercise,
              },
              {
                title: translate('giveFeedback'),
                fn: goToFeedback,
              },
            ]}
          >
            <IconButton onPress={() => setMenuOpen(true)}>
              <Icon
                icon="ellipsis-vertical"
                color={colors.onPrimary}
              />
            </IconButton>
          </MenuViewWrapped>
        )}
      </HeaderRight>
    </>
  )
}

export default observer(StepHeader)
