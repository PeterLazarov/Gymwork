import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import ExerciseEditForm from 'app/components/Exercise/ExerciseEditForm'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, ExerciseModel } from 'app/db/models'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import {
  Button,
  ButtonText,
  HeaderRight,
  HeaderTitle,
  Icon,
  IconButton,
} from 'designSystem'

export type ExerciseEditScreenProps = StaticScreenProps<{
  // If no ID, create mode enabled
  exerciseId?: Exercise['guid']
}>

export const ExerciseEditScreen: React.FC<ExerciseEditScreenProps> = observer(
  ({ route: { params } }) => {
    const {
      theme: { colors },
    } = useAppTheme()

    const { exerciseStore } = useStores()
    const { navigate, goBack } = useNavigation()

    const { exerciseId } = params
    const createMode = !exerciseId

    const [exercise, setExercise] = useState(
      createMode
        ? ExerciseModel.create({ name: '' })
        : exerciseStore.exercisesMap[exerciseId]
    )
    if (!createMode && !exercise) {
      console.warn('REDIRECT - No exercise to edit')
      navigate('Home') // TODO instruct to navigate back?
    }

    const [formValid, setFormValid] = useState(false)

    const { showConfirm } = useDialogContext()

    function onBackPress() {
      showConfirm?.({
        message: translate('changesWillBeLost'),
        onClose: () => showConfirm?.(undefined),
        onConfirm: onBackConfirmed,
      })
    }

    function onBackConfirmed() {
      showConfirm?.(undefined)
      goBack()
    }

    function onUpdate(updated: Exercise, isValid: boolean) {
      setExercise(updated)
      setFormValid(isValid)
    }

    function onComplete() {
      if (!exercise) return

      if (createMode) {
        exerciseStore.createExercise(exercise)
      } else {
        exerciseStore.editExercise(exercise)
      }
      goBack()
    }

    return (
      <EmptyLayout>
        <HeaderRight>
          <IconButton
            onPress={onBackPress}
            //
          >
            <Icon
              icon="chevron-back"
              color={colors.onPrimary}
            />
          </IconButton>
          <HeaderTitle
            title={translate(createMode ? 'createExercise' : 'editExercise')}
          />
          <IconButton
            onPress={onComplete}
            disabled={!formValid}
            //
          >
            <Icon
              icon="checkmark"
              size="large"
              color={colors.onPrimary}
            />
          </IconButton>
        </HeaderRight>
        <ScrollView style={{ flex: 1 }}>
          {exercise && (
            <ExerciseEditForm
              exercise={exercise}
              onUpdate={onUpdate}
            />
          )}
        </ScrollView>
        <Button
          variant="primary"
          onPress={onComplete}
          disabled={!formValid}
        >
          <ButtonText variant="primary">{translate('save')}</ButtonText>
        </Button>
      </EmptyLayout>
    )
  }
)
