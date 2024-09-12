import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'

import ConfirmationDialog from 'app/components/ConfirmationDialog'
import ExerciseEditForm from 'app/components/Exercise/ExerciseEditForm'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, ExerciseModel } from 'app/db/models'
import { goBack, useRouteParams } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Header,
  Icon,
  IconButton,
  colors,
} from 'designSystem'

export type ExerciseEditScreenParams = {
  createMode?: boolean
}
const ExerciseEditScreen: React.FC = () => {
  const { stateStore, exerciseStore } = useStores()

  const { createMode } = useRouteParams('ExerciseEdit')
  const [exercise, setExercise] = useState(
    createMode ? ExerciseModel.create() : stateStore.focusedStep!.exercise
  )
  const [formValid, setFormValid] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  function onBackPress() {
    setConfirmDialogOpen(true)
  }

  function onBackConfirmed() {
    setConfirmDialogOpen(false)
    goBack()
  }

  function onUpdate(updated: Exercise, isValid: boolean) {
    setExercise(updated)
    setFormValid(isValid)
  }

  function onComplete() {
    if (createMode) {
      exerciseStore.createExercise(exercise)
    } else {
      exerciseStore.editExercise(exercise)
    }
    goBack()
  }

  return (
    <>
      <EmptyLayout>
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
          <Header.Title
            title={translate(createMode ? 'createExercise' : 'editExercise')}
          />
          <IconButton
            onPress={onComplete}
            disabled={!formValid}
            underlay="darker"
          >
            <Icon
              icon="checkmark"
              size="large"
              color={colors.primaryText}
            />
          </IconButton>
        </Header>
        <KeyboardAvoiderView
          avoidMode="focused-input"
          style={{ flex: 1 }}
        >
          <ExerciseEditForm
            exercise={exercise}
            onUpdate={onUpdate}
          />

          <Button
            variant="primary"
            onPress={onComplete}
            disabled={!formValid}
          >
            <ButtonText variant="primary">{translate('save')}</ButtonText>
          </Button>
        </KeyboardAvoiderView>
      </EmptyLayout>
      <ConfirmationDialog
        open={confirmDialogOpen}
        message={translate('changesWillBeLost')}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={onBackConfirmed}
      />
    </>
  )
}
export default observer(ExerciseEditScreen)
