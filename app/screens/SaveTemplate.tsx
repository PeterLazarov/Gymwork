import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'

import ConfirmationDialog from 'app/components/ConfirmationDialog'
import EditTemplateForm from 'app/components/WorkoutTemplate/EditTemplateForm'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutTemplate, WorkoutTemplateModel } from 'app/db/models'
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

const SaveWorkoutScreen: React.FC = () => {
  const { workoutStore } = useStores()

  const [template, setTemplate] = useState(WorkoutTemplateModel.create())
  const [formValid, setFormValid] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  function onBackPress() {
    setConfirmDialogOpen(true)
  }

  function onBackConfirmed() {
    setConfirmDialogOpen(false)
    goBack()
  }

  function onUpdate(updated: WorkoutTemplate, isValid: boolean) {
    setTemplate(updated)
    setFormValid(isValid)
  }

  function onComplete() {
    workoutStore.saveWorkoutTemplate(template.name)
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
          <Header.Title title={translate('saveTemplate')} />
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
          <EditTemplateForm
            template={template}
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
        message={translate('workoutWillNotBeSaved')}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={onBackConfirmed}
      />
    </>
  )
}
export default observer(SaveWorkoutScreen)
