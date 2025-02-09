import React from 'react'
import { View, ViewStyle } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { Text, ThemedStyle } from 'designSystem'

import TemplateStepsListItem from './TemplateStepsListItem'

export type TemplateStepsListProps = {
  steps: WorkoutStep[]
  onStepRemove: (step: WorkoutStep) => void
}

const TemplateStepsList: React.FC<TemplateStepsListProps> = ({
  steps,
  onStepRemove,
}) => {
  const {
    theme: {
      typography: { fontSize },
    },
    themed,
  } = useAppTheme()

  return (
    <>
      <Text style={{ fontSize: fontSize.lg }}>{translate('exercises')}</Text>
      <View style={themed($exerciseList)}>
        {steps.map(step => (
          <TemplateStepsListItem
            key={step.guid}
            step={step}
            onStepRemove={onStepRemove}
          />
        ))}
      </View>
    </>
  )
}

const $exerciseList: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderColor: colors.outlineVariant,
  borderRadius: 8,
  borderWidth: 1,
  gap: spacing.xxs,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
})

export default TemplateStepsList
