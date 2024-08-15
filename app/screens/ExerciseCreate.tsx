import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, Button } from 'react-native-paper'

import ConfirmationDialog from '../components/ConfirmationDialog'
import ExerciseEditForm from '../components/Exercise/ExerciseEditForm'
import { useStores } from '../db/helpers/useStores'
import { Exercise, ExerciseModel } from '../db/models'
import { Icon } from '../../designSystem'
import colors from '../../designSystem/colors'
import { AppStackScreenProps } from 'app/navigators'

interface ExerciseCreatePageProps
  extends AppStackScreenProps<'ExerciseCreate'> {}

const ExerciseCreatePage: React.FC<ExerciseCreatePageProps> = ({
  navigation,
}) => {
  const { exerciseStore } = useStores()

  const [exercise, setExercise] = useState(ExerciseModel.create())
  const [formValid, setFormValid] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  function onBackPress() {
    setConfirmDialogOpen(true)
  }

  function onBackConfirmed() {
    setConfirmDialogOpen(false)
    navigation.goBack()
  }

  function onUpdate(updated: Exercise, isValid: boolean) {
    setExercise(updated)
    setFormValid(isValid)
  }

  function onComplete() {
    exerciseStore.createExercise(exercise)
    navigation.goBack()
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
          <Appbar.BackAction onPress={onBackPress} />
          <Appbar.Content title="Create exercise" />
          <Appbar.Action
            icon={() => (
              <Icon
                icon="checkmark"
                size="large"
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

        <View
          style={{
            backgroundColor: formValid ? colors.primary : colors.disabled,
          }}
        >
          <Button
            mode="text"
            onPress={onComplete}
            disabled={!formValid}
            textColor={colors.white}
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
export default observer(ExerciseCreatePage)
