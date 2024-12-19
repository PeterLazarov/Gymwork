import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import React, { useState } from 'react'
import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import EditTemplateForm from 'app/components/WorkoutTemplate/EditTemplateForm'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import {
  WorkoutStep,
  WorkoutTemplate,
  WorkoutTemplateModel,
} from 'app/db/models'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { useRouteParams } from 'app/navigators'
import { Button, ButtonText, Header, Icon, IconButton } from 'designSystem'

export type SaveTemplateScreenParams = {
  edittingTemplate?: WorkoutTemplate
}

export const SaveTemplateScreen: React.FC = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()

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
    navStore.navigate('WorkoutStack', { screen: 'Workout' })
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
      <View style={{ flex: 1 }}>
        <EditTemplateForm
          template={template}
          steps={templateSteps}
          onUpdateSteps={steps => setTemplateSteps(steps)}
          onUpdate={onUpdate}
        />
      </View>
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
