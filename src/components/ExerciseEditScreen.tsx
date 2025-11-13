import React, { useRef, useState } from "react"
import { ScrollView, View } from "react-native"
import { HelperText, TextInput } from "react-native-paper"

import { measurementDefaults, measurementTypes, MetricType } from "@/constants/enums"
import { muscleAreas, muscles } from "@/constants/muscles"
import { DistanceUnit, measurementUnits, WeightUnit } from "@/constants/units"
import { useDialogContext } from "@/context/DialogContext"
import { useSetting } from "@/context/SettingContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { useInsertExerciseQuery } from "@/db/queries/useInsertExerciseQuery"
import { useUpdateExerciseQuery } from "@/db/queries/useUpdateExerciseQuery"
import { ExerciseMetric } from "@/db/schema"
import {
  Button,
  Header,
  Icon,
  IconButton,
  Multiselect,
  NumberInput,
  palettes,
  Select,
  spacing,
  Text,
  ToggleSwitch,
  useColors,
} from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { useRouteParams } from "@/navigators/navigationTypes"
import { translate } from "@/utils"
import { goBack, navigate } from "@/navigators/navigationUtilities"
import { MuscleMap } from "./shared/MuscleMap"
import { useSettingsQuery } from "@/db/queries/useSettingsQuery"

export type ExerciseEditScreenParams = {
  edittedExercise?: ExerciseModel
}
export const ExerciseEditScreen: React.FC = () => {
  const colors = useColors()
  const updateExercise = useUpdateExerciseQuery()
  const insertExercise = useInsertExerciseQuery()
  const { edittedExercise } = useRouteParams("ExerciseEdit")
  if (!edittedExercise) {
    console.warn("REDIRECT - No focusedExercise")
    navigate("ExerciseSelect", {
      selectMode: "plain",
    })
  }
  const hasChanges = useRef(false)

  const [exercise, setExercise] = useState<ExerciseModel>(
    edittedExercise ? edittedExercise! : new ExerciseModel(),
  )
  const [formValid, setFormValid] = useState(false)

  const { showConfirm } = useDialogContext()

  function onBackPress() {
    if (hasChanges.current) {
      showConfirm?.({
        message: translate("changesWillBeLost"),
        onConfirm: goBack,
      })
    } else {
      goBack()
    }
  }

  function onUpdate(updated: ExerciseModel, isValid: boolean) {
    setExercise(ExerciseModel.copy(updated))
    setFormValid(isValid)
    hasChanges.current = true
  }

  function onComplete() {
    if (!exercise) return

    if (edittedExercise) {
      updateExercise(exercise.id!, exercise)
    } else {
      insertExercise(exercise)
    }
    goBack()
  }

  return (
    <BaseLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate(edittedExercise ? "editExercise" : "createExercise")} />
        <IconButton
          onPress={onComplete}
          disabled={!formValid}
          underlay="darker"
        >
          <Icon
            icon="checkmark"
            size="large"
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>
      <ScrollView style={{ flex: 1 }}>
        {exercise && (
          <ExerciseEditForm
            exercise={exercise}
            onUpdate={onUpdate}
          />
        )}
      </ScrollView>
      <Button
        variant="primary"
        onPress={onComplete}
        disabled={!formValid}
        text={translate("save")}
      />
    </BaseLayout>
  )
}

type Props = {
  exercise: ExerciseModel
  onUpdate: (updated: ExerciseModel, isValid: boolean) => void
}

const ExerciseEditForm: React.FC<Props> = ({ exercise, onUpdate }) => {
  const { settings } = useSettingsQuery()
  const colors = useColors()
  const [nameError, setNameError] = useState("")
  const [weightIncError, setWeightIncError] = useState("")
  const [musclesError, setMusclesError] = useState("")
  const [measurementTypeError, setMeasurementTypeError] = useState("")
  const [showMuscleMap, setShowMuscleMap] = useState(true)

  function runValidCheck(data: ExerciseModel) {
    const nameInvalid = data.name.trim() === ""
    const weightIncrementInvalid = data.getMetricByType("weight")?.step_value === 0
    const musclesInvalid = data.muscles.length === 0 && data.muscleAreas.length === 0
    const measurementsInvalid = data.metricTypes.length === 0

    setNameError(nameInvalid ? "Exercise name cannot be empty." : "")
    setWeightIncError(weightIncrementInvalid ? "Weight increment cannot be 0." : "")
    setMusclesError(musclesInvalid ? "At least one muscle area required." : "")
    setMeasurementTypeError(measurementsInvalid ? "At least one measurement type required." : "")

    return !(nameInvalid || weightIncrementInvalid || musclesInvalid || measurementsInvalid)
  }

  function onFormChange(updated: ExerciseModel) {
    const valid = runValidCheck(updated)
    onUpdate(updated, valid)
  }

  function onMusclesChange(selected: string[]) {
    const updated = exercise.update({ muscles: selected })
    onFormChange(updated)
  }
  function onMuscleAreasChange(selected: string[]) {
    const updated = exercise.update({ muscleAreas: selected })
    onFormChange(updated)
  }
  function onPropChange(field: keyof ExerciseModel, value: string) {
    const updated = exercise.update({ [field]: value })
    onFormChange(updated)
  }

  function setMeasurementTypes(measurementNames: MetricType[]) {
    const metrics = measurementNames.map(
      (m) =>
        ({
          measurement_type: m,
          unit: measurementDefaults[m].unit,
          more_is_better: measurementDefaults[m].moreIsBetter,
          step_value: "step" in measurementDefaults[m] ? measurementDefaults[m].step : null,
        }) as ExerciseMetric,
    )
    const updated = exercise.update({ metrics })
    onFormChange(updated)
  }

  function onMetricChange(metricType: MetricType, metric: ExerciseMetric) {
    const otherMetrics = exercise.metrics.filter((m) => m.measurement_type !== metricType)
    const updated = exercise.update({ metrics: [...otherMetrics, metric] })
    onFormChange(updated)
  }

  return (
    <View style={{ flex: 1, gap: 8, padding: 8 }}>
      <TextInput
        label="Name"
        value={exercise.name}
        onChangeText={(text) => onPropChange("name", text)}
        error={nameError !== ""}
      />
      {nameError !== "" && (
        <HelperText
          type="error"
          visible={nameError !== ""}
        >
          {nameError}
        </HelperText>
      )}
      {showMuscleMap && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: spacing.lg,
          }}
        >
          <MuscleMap
            muscles={exercise.muscles}
            muscleAreas={exercise.muscleAreas}
            activeColor={palettes.gold["80"]}
            inactiveColor={colors.outline}
            baseColor={colors.bodyBase}
          />
          <MuscleMap
            back
            muscles={exercise.muscles}
            muscleAreas={exercise.muscleAreas}
            activeColor={palettes.gold["80"]}
            inactiveColor={colors.outline}
            baseColor={colors.bodyBase}
          />
        </View>
      )}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.sm }}>
        {settings && settings.scientific_muscle_names_enabled && (
          <Multiselect
            options={muscles}
            selectedValues={exercise.muscles}
            onSelect={onMusclesChange}
            containerStyle={{ flex: 1 }}
            headerText={translate("muscles")}
            error={musclesError !== ""}
          />
        )}
        {settings && !settings.scientific_muscle_names_enabled && (
          <Multiselect
            options={muscleAreas}
            selectedValues={exercise.muscleAreas}
            onSelect={onMuscleAreasChange}
            containerStyle={{ flex: 1 }}
            headerText={translate("muscleAreas")}
            error={musclesError !== ""}
          />
        )}
        <Button
          variant={showMuscleMap ? "primary" : "secondary"}
          onPress={() => setShowMuscleMap(!showMuscleMap)}
          style={{
            marginTop: spacing.md,
            borderRadius: spacing.xs,
            width: spacing.xl,
            height: spacing.xl,
          }}
        >
          <Icon
            icon="arm-flex"
            color={showMuscleMap ? colors.onPrimary : colors.onSurface}
          />
        </Button>
      </View>
      {musclesError !== "" && (
        <HelperText
          type="error"
          visible={musclesError !== ""}
        >
          {musclesError}
        </HelperText>
      )}
      <Multiselect
        options={measurementTypes}
        selectedValues={exercise.metricTypes as string[]}
        headerText="Measurements"
        onSelect={(selection) => {
          setMeasurementTypes(selection as MetricType[])
        }}
        error={!!measurementTypeError}
      />
      {exercise.hasMetricType("distance") && (
        <DistanceSection
          metricConfig={exercise.getMetricByType("distance")!}
          onMetricChange={(metric) => onMetricChange("distance", metric)}
        />
      )}
      {exercise.hasMetricType("weight") && (
        <WeightSection
          metricConfig={exercise.getMetricByType("weight")!}
          onMetricChange={(metric) => onMetricChange("weight", metric)}
          weightIncError={weightIncError}
        />
      )}
      {exercise.hasMetricType("duration") && (
        <DurationSection
          metricConfig={exercise.getMetricByType("duration")!}
          onMetricChange={(metric) => onMetricChange("duration", metric)}
        />
      )}
    </View>
  )
}

type DistanceSectionProps = {
  metricConfig: ExerciseMetric
  onMetricChange: (metric: ExerciseMetric) => void
}

const DistanceSection: React.FC<DistanceSectionProps> = ({ metricConfig, onMetricChange }) => {
  function setUnit(unit: DistanceUnit) {
    onMetricChange({ ...metricConfig, unit })
  }

  function toggleMoreIsBetter(value: boolean) {
    onMetricChange({ ...metricConfig, more_is_better: value })
  }

  return (
    <>
      <Text>{translate("distanceMeasurementSettings")}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>{translate("moreIsBetter")}</Text>
        <ToggleSwitch
          variant="primary"
          value={metricConfig.more_is_better}
          onValueChange={toggleMoreIsBetter}
        />
      </View>

      <Select
        options={Object.values(measurementUnits.distance)}
        headerText={translate("unit")}
        value={metricConfig.unit}
        onChange={(distanceUnit) => setUnit(distanceUnit as DistanceUnit)}
        label={translate("unit")}
      />
    </>
  )
}

type DurationSectionProps = {
  metricConfig: ExerciseMetric
  onMetricChange: (metric: ExerciseMetric) => void
}

const DurationSection: React.FC<DurationSectionProps> = ({ metricConfig, onMetricChange }) => {
  function toggleMoreIsBetter(value: boolean) {
    onMetricChange({ ...metricConfig, more_is_better: value })
  }

  return (
    <>
      <Text>{translate("durationMeasurementSettings")}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>{translate("moreIsBetter")}</Text>
        <ToggleSwitch
          variant="primary"
          value={metricConfig.more_is_better}
          onValueChange={toggleMoreIsBetter}
        />
      </View>
    </>
  )
}

type WeightSectionProps = {
  metricConfig: ExerciseMetric
  onMetricChange: (metric: ExerciseMetric) => void
  weightIncError?: string
}

const WeightSection: React.FC<WeightSectionProps> = ({
  metricConfig,
  onMetricChange,
  weightIncError,
}) => {
  function setUnit(unit: WeightUnit) {
    onMetricChange({ ...metricConfig, unit })
  }

  function toggleMoreIsBetter(value: boolean) {
    onMetricChange({ ...metricConfig, more_is_better: value })
  }

  function handleWeightIncrementChange(n: number) {
    onMetricChange({ ...metricConfig, step_value: n })
  }

  return (
    <>
      <Text>{translate("weightMeasurementSettings")}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>{translate("moreIsBetter")}</Text>
        <ToggleSwitch
          variant="primary"
          value={metricConfig.more_is_better}
          onValueChange={toggleMoreIsBetter}
        />
      </View>
      <Select
        options={Object.values(measurementUnits.weight)}
        headerText={translate("unit")}
        value={metricConfig.unit}
        onChange={(unit) => setUnit(unit as WeightUnit)}
        label={translate("unit")}
      />
      <NumberInput
        value={metricConfig.step_value ?? 0}
        onChange={(n) => handleWeightIncrementChange(n ?? 0)}
        label="Weight Increment"
        error={weightIncError !== ""}
      />
      {weightIncError !== "" && (
        <HelperText
          type="error"
          visible={weightIncError !== ""}
        >
          {weightIncError}
        </HelperText>
      )}
    </>
  )
}
