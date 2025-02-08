import { useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import { getActiveRouteName } from '@/navigators'
import { useAppTheme } from '@/utils/useAppTheme'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { HeaderRight, HeaderTitle, Icon, IconButton } from 'designSystem'
import { MenuViewWrapped } from 'designSystem/components/MenuViewWrapped'

export type StepHeaderProps = {
  step: WorkoutStep
  onSwitchExercise: () => void
}

const StepHeader: React.FC<StepHeaderProps> = ({ step, onSwitchExercise }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const { stateStore } = useStores()

  const navigation = useNavigation()

  const { showSnackbar } = useDialogContext()

  const deleteSelectedExercises = () => {
    const undoDelete = stateStore.deleteFocusedStep()

    navigation.navigate('Home', {
      screen: 'WorkoutStack',
      params: {
        screen: 'Workout',
        params: {},
      },
    })

    showSnackbar!({
      text: 'Exercise was removed from workout',
      actionText: 'Undo',
      action: undoDelete,
    })
  }

  const toggleFavoriteExercise = () => {
    const exercise = stateStore.focusedExercise!
    exercise.setProp('isFavorite', !exercise.isFavorite)
  }

  function onSwitchExercisePress() {
    onSwitchExercise()
  }

  function onEditExercisePress() {
    navigation.navigate('ExerciseEdit', {
      exerciseId: stateStore.focusedExercise.guid,
    })
  }
  function goToFeedback() {
    navigation.navigate('UserFeedback', {
      referrerPage: getActiveRouteName(navigation.getState()!),
    })
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
            <IconButton>
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
