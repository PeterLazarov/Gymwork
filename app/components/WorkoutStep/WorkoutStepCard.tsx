import React from 'react'
import { observer } from 'mobx-react-lite'

import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { Card, useColors } from 'designSystem'
import { CardProps } from 'designSystem/Card'
import SetEditList from './ExerciseTrackView/SetEditList'
import { View, ViewStyle } from 'react-native'
import { Button, Icon, IconButton } from 'designSystem'

export type WorkoutStepCardProps = {
  step: WorkoutStep
  selectedSet: WorkoutSet | null
  onSelectSet(set: WorkoutSet): void
  onPressAdd(): void
  onDragStart(): void
  onDragEnd(): void
} & Partial<CardProps>

const WorkoutStepCard: React.FC<WorkoutStepCardProps> = ({
  step,
  selectedSet,
  containerStyle,
  onSelectSet,
  onPressAdd,
  onDragStart,
  onDragEnd,
  ...rest
}) => {
  const colors = useColors()

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
            selectedSet={selectedSet}
            onPressSet={onSelectSet}
            showFallback={false}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
          <IconButton
            size="md"
            onPress={onPressAdd}
            style={{
              alignSelf: 'center',
              transform: [{ translateY: 8 }],
            }}
          >
            <Icon
              size="large"
              icon="add"
            />
          </IconButton>
        </>
      }
      {...rest}
      containerStyle={[
        {
          marginVertical: 8,
          marginHorizontal: 8,
          ...(containerStyle ?? ({} as ViewStyle)),
        },
      ]}
    />
  )
}

export default observer(WorkoutStepCard)
