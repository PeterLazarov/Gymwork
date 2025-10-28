import { ListRenderItemInfo } from "@shopify/flash-list"
import React from "react"

import { StepSetsList } from "@/components/shared/StepSetsList"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { Card, CardProps, IndicatedScrollList, spacing } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"

type Props = {
  workout: WorkoutModel
}

export const WorkoutStepList: React.FC<Props> = ({ workout }) => {
  function onCardPress(step: WorkoutStepModel) {
    navigate("WorkoutStep", { focusedStep: step })
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<WorkoutStepModel>) => {
    const isLast = index === workout.workoutSteps.length - 1
    return (
      <WorkoutStepCard
        step={item}
        workout={workout}
        onPress={() => onCardPress(item)}
        containerStyle={{
          marginBottom: isLast ? 0 : undefined,
        }}
      />
    )
  }

  return (
    <IndicatedScrollList
      data={workout.workoutSteps.slice()}
      renderItem={renderItem}
      keyExtractor={(item) => `${workout!.date}_${item.id}`}
    />
  )
}

export type WorkoutStepCardProps = {
  step: WorkoutStepModel
  workout: WorkoutModel
} & Partial<CardProps>

const WorkoutStepCard: React.FC<WorkoutStepCardProps> = ({ step, workout, ...rest }) => {
  const title =
    step.stepType === "plain"
      ? step.exercises[0].name
      : step.exercises.map((e) => `${e.name}`).join("\n")

  return (
    <Card
      title={title}
      content={
        <StepSetsList
          step={step}
          sets={step.sets}
          workout={workout}
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
