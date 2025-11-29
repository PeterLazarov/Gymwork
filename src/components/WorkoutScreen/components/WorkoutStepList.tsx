import React from "react"
import { View } from "react-native"

import { StepSetsList } from "@/components/shared/StepSetsList"
import { useReorderWorkoutSteps } from "@/db/hooks"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { Card, CardProps, DraggableList, spacing, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { DragListRenderItemInfo } from "react-native-draglist"

type Props = {
  workout: WorkoutModel
}

export const WorkoutStepList: React.FC<Props> = ({ workout }) => {
  const { mutate: reorderSteps } = useReorderWorkoutSteps()

  function onCardPress(step: WorkoutStepModel) {
    navigate("WorkoutStep", { focusedStep: step })
  }

  const renderItem = ({ item, index, onDragStart, onDragEnd, isActive }: DragListRenderItemInfo<WorkoutStepModel>) => {
    const isLast = index === workout.workoutSteps.length - 1
    return (
      <WorkoutStepCard
        step={item}
        workout={workout}
        onPress={() => onCardPress(item)}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isActive={isActive}
        containerStyle={{
          marginBottom: isLast ? 0 : undefined,
        }}
      />
    )
  }

  return (
    <DraggableList
      data={workout.workoutSteps}
      renderItem={renderItem}
      keyExtractor={(item) => `${workout!.date}_${item.id}`}
      onReorder={({from, to}) => reorderSteps({ workoutId: workout.id, from, to})}
    />
  )
}

export type WorkoutStepCardProps = {
  step: WorkoutStepModel
  workout: WorkoutModel
  onDragStart?: () => void
  onDragEnd?: () => void
  isActive?: boolean
} & Partial<CardProps>

const WorkoutStepCard: React.FC<WorkoutStepCardProps> = ({ step, workout, onDragStart, onDragEnd, isActive, ...rest }) => {
  const colors = useColors()
  const title =
    step.stepType === "plain"
      ? step.exercises[0].name
      : step.exercises.map((e) => `${e.name}`).join("\n")

  return (
    <Card
      title={title}
      content={
        <View style={{ opacity: isActive ? 0 : 1 }}>
          <StepSetsList
            step={step}
            sets={step.sets}
            workout={workout}
          />
        </View>
      }
      {...rest}
      onLongPress={onDragStart}
      onPressOut={onDragEnd}
      delayLongPress={200}
      containerStyle={{
        marginVertical: spacing.sm,
        marginHorizontal: spacing.md,
        backgroundColor: isActive ? colors.surfaceContainerHighest : colors.surface,
        transform: isActive ? [{ scale: 0.98 }] : [],
      }}
    />
  )
}
