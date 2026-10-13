import convert, { Unit } from "convert-units"
import { Duration } from "luxon"
import React, { useMemo, useState } from "react"
import { View } from "react-native"

import { DistanceEditor } from "@/components/WorkoutStep/components/DistanceEditor"
import { DistanceUnit } from "@/constants/units"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import type { TargetMetric } from "@/db/schema"
import {
  Button,
  Divider,
  DurationInput,
  fontSize,
  IncrementNumericEditor,
  spacing,
  Text,
  ToggleGroupButton,
} from "@/designSystem"
import { convertBaseWeightToUnit, convertWeightToBase, translate } from "@/utils"
import type { TxKeyPath } from "@/utils/i18n/i18n"

const metricLabels: Record<TargetMetric, TxKeyPath> = {
  reps: "targetReps",
  tonnage: "targetTonnage",
  distance: "targetDistance",
  duration: "targetDuration",
}

type TargetFormProps = {
  exercise: ExerciseModel
  initialMetric?: TargetMetric | null
  initialValueBase?: number | null
  submitText: string
  onSubmit: (metric: TargetMetric, valueBase: number) => void
  onCancel: () => void
}

export const TargetForm: React.FC<TargetFormProps> = ({
  exercise,
  initialMetric,
  initialValueBase,
  submitText,
  onSubmit,
  onCancel,
}) => {
  const options = useMemo(() => exercise.getTargetableMetrics(), [exercise])
  const [metric, setMetric] = useState<TargetMetric | null>(
    initialMetric && options.includes(initialMetric) ? initialMetric : null,
  )
  const [valueBase, setValueBase] = useState(initialValueBase ?? 0)

  const activeMetric: TargetMetric | undefined = metric ?? options[0]
  const isValid = !!activeMetric && options.includes(activeMetric) && valueBase > 0

  const valueUnit = activeMetric === "tonnage" ? exercise.getMetricByType("weight")?.unit : undefined

  if (options.length === 0 || !activeMetric) return null

  return (
    <View style={{ gap: spacing.md }}>
      <FormSection label={translate("exercise")}>
        <Text>{exercise.name}</Text>
      </FormSection>

      <FormSection
        label={translate("targetMetric")}
        unit={options.length === 1 ? translate(metricLabels[activeMetric]) : undefined}
      >
        {options.length > 1 && (
          <ToggleGroupButton
            buttons={options.map((option) => ({
              text: translate(metricLabels[option]),
              value: option,
            }))}
            initialActiveIndex={options.indexOf(activeMetric)}
            onChange={(value) => {
              if (value !== activeMetric) {
                setMetric(value as TargetMetric)
                setValueBase(0)
              }
            }}
          />
        )}
      </FormSection>

      <FormSection
        label={translate("targetValue")}
        unit={valueUnit}
      >
        <TargetValueEditor
          exercise={exercise}
          metric={activeMetric}
          valueBase={valueBase}
          onChange={setValueBase}
        />
      </FormSection>

      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <Button
          variant="tertiary"
          onPress={onCancel}
          style={{ flex: 1 }}
          text={translate("cancel")}
        />
        <Button
          variant="primary"
          disabled={!isValid}
          onPress={() => {
            if (isValid) onSubmit(activeMetric, valueBase)
          }}
          style={{ flex: 1 }}
          text={submitText}
        />
      </View>
    </View>
  )
}

type FormSectionProps = {
  label: string
  unit?: string
  children?: React.ReactNode
}

const FormSection: React.FC<FormSectionProps> = ({ label, unit, children }) => {
  return (
    <View style={{ gap: spacing.xxs }}>
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: fontSize.xs,
              textTransform: "uppercase",
              marginVertical: spacing.xxs,
            }}
          >
            {label}
          </Text>
          {unit && (
            <Text
              style={{
                fontSize: fontSize.xs,
                textTransform: "uppercase",
                marginVertical: spacing.xxs,
              }}
            >
              {unit}
            </Text>
          )}
        </View>
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
      </View>
      {children}
    </View>
  )
}

type TargetValueEditorProps = {
  exercise: ExerciseModel
  metric: TargetMetric
  valueBase: number
  onChange: (valueBase: number) => void
}

const TargetValueEditor: React.FC<TargetValueEditorProps> = ({
  exercise,
  metric,
  valueBase,
  onChange,
}) => {
  switch (metric) {
    case "reps":
      return (
        <IncrementNumericEditor
          testID="target-value-reps"
          value={valueBase}
          onChange={(value) => onChange(value ?? 0)}
          maxDecimals={0}
        />
      )
    case "tonnage": {
      const weightMetric = exercise.getMetricByType("weight")!
      return (
        <IncrementNumericEditor
          testID="target-value-tonnage"
          value={convertBaseWeightToUnit(valueBase, weightMetric.unit)}
          onChange={(value) =>
            onChange(value ? convertWeightToBase(value, weightMetric.unit) : 0)
          }
          step={weightMetric.step_value}
        />
      )
    }
    case "distance": {
      const distanceMetric = exercise.getMetricByType("distance")!
      let displayValue = valueBase
      try {
        displayValue = convert(valueBase).from("mm").to(distanceMetric.unit as Unit)
      } catch {
        displayValue = valueBase
      }
      return (
        <DistanceEditor
          testID="target-value-distance"
          value={displayValue}
          unit={distanceMetric.unit as DistanceUnit}
          onChange={onChange}
        />
      )
    }
    case "duration": {
      const durationMetric = exercise.getMetricByType("duration")!
      return (
        <DurationInput
          value={valueBase ? Duration.fromMillis(valueBase) : undefined}
          onUpdate={(duration) => onChange(Math.round(duration.toMillis()))}
          format={durationMetric.duration_format}
        />
      )
    }
  }
}
