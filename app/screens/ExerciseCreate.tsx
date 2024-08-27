import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'

import ConfirmationDialog from 'app/components/ConfirmationDialog'
import ExerciseEditForm from 'app/components/Exercise/ExerciseEditForm'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, ExerciseModel } from 'app/db/models'
import { goBack } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Header,
  Icon,
  IconButton,
  colors,
} from 'designSystem'

const ExerciseCreate: React.FC = () => {
  const { exerciseStore } = useStores()

  const [exercise, setExercise] = useState(ExerciseModel.create())
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
    exerciseStore.createExercise(exercise)
    goBack()
  }

  return (
    <>
      <EmptyLayout>
        <Header>
          <IconButton onPress={onBackPress}>
            <Icon
              icon="chevron-back"
              color={colors.primaryText}
            />
          </IconButton>
          <Header.Title title={translate('createExercise')} />
          <IconButton
            onPress={onComplete}
            disabled={!formValid}
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
          style={{ flex: 1, overflow: 'hidden' }}
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
export default observer(ExerciseCreate)
