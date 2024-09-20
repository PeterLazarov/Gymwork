import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'

import { WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { Text, useColors, fontSize } from 'designSystem'
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
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 5,
    },
  })

export default TemplateStepsList
