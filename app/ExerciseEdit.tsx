import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, Button } from 'react-native-paper'

import ConfirmationDialog from '../components/ConfirmationDialog'
import ExerciseEditForm from '../components/Exercise/ExerciseEditForm'
import { useStores } from '../db/helpers/useStores'
import { Exercise } from '../db/models'
import { Icon } from '../designSystem'

const ExerciseEditPage: React.FC = () => {
  const router = useRouter()
  const { openedExercise, exerciseStore } = useStores()

  const [exercise, setExercise] = useState(openedExercise!)
  const [formValid, setFormValid] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  function onBackPress() {
    setConfirmDialogOpen(true)
  }

  function onBackConfirmed() {
    setConfirmDialogOpen(false)
    router.back()
  }

  function onUpdate(updated: Exercise, isValid: boolean) {
    setExercise(updated)
    setFormValid(isValid)
  }

  function onComplete() {
    exerciseStore.editExercise(exercise)
    router.back()
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Appbar.Header>
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
        <View style={{ flex: 1, gap: 8, padding: 8 }}>
          <ExerciseEditForm
            exercise={exercise}
            onUpdate={onUpdate}
          />
          <Button
            mode="contained"
            onPress={onComplete}
            disabled={!formValid}
          >
            Save
          </Button>
        </View>
      </View>
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
