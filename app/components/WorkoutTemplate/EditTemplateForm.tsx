import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

import { WorkoutStep, WorkoutTemplate } from 'app/db/models'
import { spacing } from 'designSystem'

import TemplateStepsList from './TemplateStepsList'

export type EditTemplateFormProps = {
  template: WorkoutTemplate
  steps: WorkoutStep[]
  onUpdate: (template: WorkoutTemplate, isValid: boolean) => void
  onUpdateSteps: (steps: WorkoutStep[]) => void
}

const ExerciseEditForm: React.FC<EditTemplateFormProps> = ({
  template,
  steps,
  onUpdate,
  onUpdateSteps,
}) => {
  const [nameError, setNameError] = useState('')

  function runValidCheck(data: WorkoutTemplate) {
    const nameInvalid = data.name.trim() === ''

    setNameError(nameInvalid ? 'Exercise name cannot be empty.' : '')

    return !nameInvalid
  }

  function onNameChange(value: string) {
    const updated = { ...template, name: value }
    const valid = runValidCheck(updated)
    onUpdate(updated, valid)
  }

  function onStepRemove(step: WorkoutStep) {
    const filtered = steps.filter(s => s.guid !== step.guid)
    onUpdateSteps(filtered)
  }

  return (
    <View style={{ flex: 1, gap: spacing.xs, padding: spacing.xs }}>
      <TextInput
        label="Name"
        value={template.name}
        onChangeText={onNameChange}
        error={nameError !== ''}
      />
      {nameError !== '' && (
        <HelperText
          type="error"
          visible={nameError !== ''}
        >
          {nameError}
        </HelperText>
      )}
      {steps.length > 0 && (
        <TemplateStepsList
          steps={steps}
          onStepRemove={onStepRemove}
        />
      )}
    </View>
  )
}
export default observer(ExerciseEditForm)
