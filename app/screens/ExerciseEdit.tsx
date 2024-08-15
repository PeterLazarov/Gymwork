import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Appbar } from 'react-native-paper'

import ConfirmationDialog from 'app/components/ConfirmationDialog'
import ExerciseEditForm from 'app/components/Exercise/ExerciseEditForm'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { goBack } from 'app/navigators'
import { Button, ButtonText, Icon, colors } from 'designSystem'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'

const ExerciseEditPage: React.FC = () => {
  const { stateStore, exerciseStore } = useStores()

  const [exercise, setExercise] = useState(stateStore.openedExercise!)
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
    exerciseStore.editExercise(exercise)
    goBack()
  }

  return (
    <>
      <EmptyLayout>
        <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
          <Appbar.BackAction onPress={onBackPress} />
          <Appbar.Content title="Update exercise" />
          <Appbar.Action
            icon={() => (
              <Icon
                icon="checkmark"
                size="large"
              />
            )}
            disabled={!formValid}
            onPress={onComplete}
            animated={false}
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
          <ButtonText variant="primary">Save</ButtonText>
        </Button>
      </EmptyLayout>
      <ConfirmationDialog
        open={confirmDialogOpen}
        message="Any changes made will be lost."
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={onBackConfirmed}
      />
    </>
  )
}
export default observer(ExerciseEditPage)
