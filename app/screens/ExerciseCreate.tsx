import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Appbar } from 'react-native-paper'

import ConfirmationDialog from 'app/components/ConfirmationDialog'
import ExerciseEditForm from 'app/components/Exercise/ExerciseEditForm'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, ExerciseModel } from 'app/db/models'
import { goBack } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { translate } from 'app/i18n'
import { Button, ButtonText, Icon, colors } from 'designSystem'

const ExerciseCreatePage: React.FC = () => {
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
        <Appbar.Header style={{ backgroundColor: colors.primary }}>
          <Appbar.BackAction
            onPress={onBackPress}
            color={colors.primaryText}
          />
          <Appbar.Content
            title={translate('createExercise')}
            color={colors.primaryText}
          />
          <Appbar.Action
            icon={() => (
              <Icon
                icon="checkmark"
                size="large"
                color={colors.primaryText}
              />
            )}
            onPress={onComplete}
            animated={false}
            disabled={!formValid}
          />
        </Appbar.Header>

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
export default observer(ExerciseCreatePage)
