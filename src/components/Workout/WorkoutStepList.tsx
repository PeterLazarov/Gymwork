import { observer } from "mobx-react-lite"
import React from "react"
import { ListRenderItemInfo } from "@shopify/flash-list"

// import { useStores } from "app/db/helpers/useStores"
import { Card, CardProps, IndicatedScrollList, spacing } from "@/designSystem"
import { Workout, WorkoutStep } from "@/db/schema"

type Props = {
  workout: Workout
}

export const WorkoutStepList: React.FC<Props> = ({ workout }) => {
  //   const {
  //     stateStore,
  //     navStore: { navigate },
  //   } = useStores()

  function onCardPress(stepGuid: string) {
    // stateStore.setFocusedStep(stepGuid)
    navigate("WorkoutStep")
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<WorkoutStep>) => {
    const isLast = index === workout.steps.length - 1
    return (
      <WorkoutStepCard
        step={item}
        onPress={() => onCardPress(item.guid)}
        containerStyle={{
          marginBottom: isLast ? 0 : undefined,
        }}
      />
    )
  }

  return (
    <IndicatedScrollList
      data={workout.steps.slice()}
      renderItem={renderItem}
      keyExtractor={(item) => `${workout!.date}_${item.guid}`}
      estimatedItemSize={140}
    />
  )
}

export type WorkoutStepCardProps = {
  step: WorkoutStep
} & Partial<CardProps>

const WorkoutStepCard: React.FC<WorkoutStepCardProps> = ({ step, ...rest }) => {
  const title =
    step.type === "straightSet"
      ? step.exercise!.name
      : step.exercises.map((e) => `${step.exerciseLettering[e.guid]}. ${e.name}`).join("\n")

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
