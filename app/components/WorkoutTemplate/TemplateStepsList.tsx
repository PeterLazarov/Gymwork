import React from 'react'
import { View } from 'react-native'

import { WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { Text, Icon, IconButton, useColors, fontSize } from 'designSystem'

type Props = {
  steps: WorkoutStep[]
  onStepRemove: (step: WorkoutStep) => void
}

const TemplateStepsList: React.FC<Props> = ({ steps, onStepRemove }) => {
  const colors = useColors()

  return (
    <>
      <Text style={{ fontSize: fontSize.lg }}>{translate('exercises')}</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.neutralDarker,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          gap: 5,
        }}
      >
        {steps.map(step => (
          <View
            key={step.guid}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text
              style={{
                fontSize: fontSize.md,
                flex: 1,
              }}
            >
              {step.exercise!.name}
            </Text>
            <IconButton onPress={() => onStepRemove(step)}>
              <Icon icon="delete" />
            </IconButton>
          </View>
        ))}
      </View>
    </>
  )
}
export default TemplateStepsList
