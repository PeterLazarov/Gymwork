import { observer } from 'mobx-react-lite'
import React from 'react'

import { WorkoutStep } from 'app/db/models'
import { Card, CardProps, spacing } from 'designSystem'

import StepSetsList from './StepSetsList'

export type WorkoutStepCardProps = {
  step: WorkoutStep
} & Partial<CardProps>

const WorkoutStepCard: React.FC<WorkoutStepCardProps> = ({ step, ...rest }) => {
  const title =
    step.type === 'straightSet'
      ? step.exercise!.name
      : step.exercises
          .map(e => `${step.exerciseLettering[e.guid]}. ${e.name}`)
          .join('\n')

  return (
    <Card
      title={title}
      content={
        <StepSetsList
          step={step}
          sets={step.sets}
        />
      }
      {...rest}
      containerStyle={{
        marginVertical: spacing.sm,
        marginHorizontal: spacing.md,
      }}
    />
  )
}

export default observer(WorkoutStepCard)
