import React from 'react'
import { observer } from 'mobx-react-lite'

import { WorkoutStep } from 'app/db/models'
import { Card } from 'designSystem'
import { CardProps } from 'designSystem/Card'
import SetEditList from './ExerciseTrackView/SetEditList'

export type WorkoutStepCardProps = {
  step: WorkoutStep
} & Partial<CardProps>

const WorkoutStepCard: React.FC<WorkoutStepCardProps> = ({
  step,
  containerStyle,
  ...rest
}) => {
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
        <>
          <SetEditList
            step={step}
            sets={step.sets}
            selectedSet={null}
            setSelectedSet={() => {}}
            showFallback={false}
          ></SetEditList>
        </>
      }
      {...rest}
      containerStyle={[
        {
          marginVertical: 8,
          marginHorizontal: 8,
          ...(containerStyle ?? {}),
        },
      ]}
    />
  )
}

export default observer(WorkoutStepCard)
