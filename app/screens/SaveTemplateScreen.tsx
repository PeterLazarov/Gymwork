import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
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
import {
  Button,
  ButtonText,
  HeaderRight,
  HeaderTitle,
  Icon,
  IconButton,
} from 'designSystem'

export type SaveTemplateScreenProps = StaticScreenProps<{
  edittingTemplate?: WorkoutTemplate
}>

export const SaveTemplateScreen: React.FC<SaveTemplateScreenProps> = observer(
  ({ route: { params } }) => {
    const { navigate, goBack } = useNavigation()

    const {
      theme: { colors },
    } = useAppTheme()

    const { workoutStore, stateStore } = useStores()
    const { edittingTemplate } = params

    const [template, setTemplate] = useState<WorkoutTemplate>(
      edittingTemplate ? { ...edittingTemplate } : WorkoutTemplateModel.create()
    )
    const [templateSteps, setTemplateSteps] = useState<WorkoutStep[]>(
      edittingTemplate?.steps || stateStore.openedWorkout?.steps || []
    )

    if (!edittingTemplate && !stateStore.openedWorkout?.steps) {
      console.warn('REDIRECT - No openedworkout steps')
      navigate('Home', {
        screen: 'WorkoutStack',
        params: { screen: 'Workout', params: {} },
      })
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
      goBack()
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
      goBack()
    }

    return (
      <EmptyLayout>
        <HeaderTitle title={translate('saveTemplate')} />
        <HeaderRight>
          <IconButton onPress={onBackPress}>
            <Icon
              icon="chevron-back"
              color={colors.onPrimary}
            />
          </IconButton>
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
        </HeaderRight>
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
  }
)
