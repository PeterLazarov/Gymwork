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
import { useRouteParams } from 'app/navigators'
import { Button, ButtonText, Header, Icon, IconButton } from 'designSystem'

export type ExerciseEditScreenParams = {
  createMode?: boolean
}
export const ExerciseEditScreen: React.FC = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()

  const { stateStore, exerciseStore, navStore } = useStores()

  const { createMode } = useRouteParams('ExerciseEdit')
  if (!createMode && !stateStore.focusedExercise) {
    console.warn('REDIRECT - No focusedExercise')
    navStore.navigate('ExerciseSelect')
  }

  const [exercise, setExercise] = useState(
    createMode ? ExerciseModel.create() : stateStore.focusedExercise
  )
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
    navStore.goBack()
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
    navStore.goBack()
  }

  return (
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          //
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title
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
      </Header>
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
})
