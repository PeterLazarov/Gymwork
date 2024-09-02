import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

import { WorkoutTemplate } from 'app/db/models'
import { translate } from 'app/i18n'
import { colors, fontSize } from 'designSystem'

type Props = {
  template: WorkoutTemplate
  onUpdate: (template: WorkoutTemplate, isValid: boolean) => void
}

const ExerciseEditForm: React.FC<Props> = ({ template, onUpdate }) => {
  const [nameError, setNameError] = useState('')

  function runValidCheck(data: WorkoutTemplate) {
    const nameInvalid = data.name.trim() === ''

    setNameError(nameInvalid ? 'Exercise name cannot be empty.' : '')

    return !nameInvalid
  }

  function onNameChange(value: string) {
    template.setProp('name', value)
    const valid = runValidCheck(template)
    onUpdate(template, valid)
  }

  return (
    <View style={{ flex: 1, gap: 8, padding: 8 }}>
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
      {template.steps.length > 0 && (
        <>
          <Text style={{ fontSize: fontSize.lg }}>
            {translate('exercises')}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.neutralDark,
              borderRadius: 8,
              padding: 10,
              gap: 5,
            }}
          >
            {template.steps.map(step => (
              <Text
                key={step.guid}
                style={{
                  fontSize: fontSize.md,
                }}
              >
                {step.exercise.name}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  )
}
export default observer(ExerciseEditForm)
