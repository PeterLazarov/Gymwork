import React from 'react'
import StepSetsList from './StepSetsList'
import { WorkoutStep } from 'app/db/models'
import { Card } from 'designSystem'
import { CardProps } from 'designSystem/Card'

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
      content={<StepSetsList step={step} />}
      {...rest}
    />
  )
}

export default WorkoutStepCard
