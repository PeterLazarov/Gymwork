import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'

import { WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { Text, useColors, fontSize, spacing } from 'designSystem'
import TemplateStepsListItem from './TemplateStepsListItem'

type Props = {
  steps: WorkoutStep[]
  onStepRemove: (step: WorkoutStep) => void
}

const TemplateStepsList: React.FC<Props> = ({ steps, onStepRemove }) => {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <>
      <Text style={{ fontSize: fontSize.lg }}>{translate('exercises')}</Text>
      <View style={styles.exerciseList}>
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

const makeStyles = (colors: any) =>
  StyleSheet.create({
    exerciseList: {
      borderColor: colors.outlineVariant,
      borderRadius: 8,
      borderWidth: 1,
      gap: spacing.xxs,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
    },
  })

export default TemplateStepsList
