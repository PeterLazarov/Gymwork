import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { getSnapshot } from 'mobx-state-tree'

import EditTemplateForm from 'app/components/WorkoutTemplate/EditTemplateForm'
import { useStores } from 'app/db/helpers/useStores'
import {
  WorkoutStep,
  WorkoutTemplate,
  WorkoutTemplateModel,
} from 'app/db/models'
import { useRouteParams } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Header,
  Icon,
  IconButton,
  useColors,
} from 'designSystem'
import { useDialogContext } from 'app/contexts/DialogContext'

export type SaveTemplateScreenParams = {
  edittingTemplate?: WorkoutTemplate
}
const SaveTemplateScreen: React.FC = () => {
  const colors = useColors()

  const { workoutStore, stateStore, navStore } = useStores()
  const { edittingTemplate } = useRouteParams('SaveTemplate')

  const [template, setTemplate] = useState<WorkoutTemplate>(
    edittingTemplate ? { ...edittingTemplate } : WorkoutTemplateModel.create()
  )
  const [templateSteps, setTemplateSteps] = useState<WorkoutStep[]>(
    edittingTemplate?.steps || stateStore.openedWorkout?.steps || []
  )

  if (!edittingTemplate && !stateStore.openedWorkout?.steps) {
    console.warn('REDIRECT - No openedworkout steps')
    navStore.navigate('Workout')
    return null
  }
  const [formValid, setFormValid] = useState(
    !!edittingTemplate?.name && edittingTemplate.name !== ''
  )
  const { showConfirm, showSnackbar } = useDialogContext()

  function onBackPress() {
    showConfirm?.({
      message: translate('workoutWillNotBeSaved'),
      onClose: () => showConfirm?.(undefined),
      onConfirm: onBackConfirmed,
    })
  }

  function onBackConfirmed() {
    showConfirm?.(undefined)
    navStore.goBack()
  }

  function onUpdate(updated: WorkoutTemplate, isValid: boolean) {
    setTemplate(updated)
    setFormValid(isValid)
  }

  function onComplete() {
    if (edittingTemplate) {
      edittingTemplate.mergeUpdate({
        ...template,
        steps: templateSteps.map(step => getSnapshot(step)),
      })
    } else {
      workoutStore.saveWorkoutTemplate(template.name, templateSteps)
    }
    showSnackbar!({
      text: translate('templateSaved'),
    })
    navStore.goBack()
  }

  return (
    <EmptyLayout>
      <Header>
        <IconButton onPress={onBackPress}>
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
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
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>
      <KeyboardAvoiderView
        avoidMode="focused-input"
        style={{ flex: 1, overflow: 'hidden' }}
      >
        <EditTemplateForm
          template={template}
          steps={templateSteps}
          onUpdateSteps={steps => setTemplateSteps(steps)}
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
  )
}
export default observer(SaveTemplateScreen)
