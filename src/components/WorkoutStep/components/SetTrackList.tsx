import { FlashList, FlashListRef, ListRenderItemInfo } from "@shopify/flash-list"
import { useCallback, useRef } from "react"
import { Keyboard, Pressable, View } from "react-native"

import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useSetting } from "@/context/SettingContext"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useRecordsQuery } from "@/db/queries/useRecordsQuery"
import { useUpdateSetQuery } from "@/db/queries/useUpdateSetQuery"
import {
  Divider,
  EmptyState,
  fontSize,
  Icon,
  IconProps,
  palettes,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { getFormatedDuration, translate } from "@/utils"
import { SetDataLabel } from "./SetDataLabel"

type SetTrackListProps = {
  step: WorkoutStepModel
  sets: SetModel[]
  selectedSet: SetModel | null
  setSelectedSet: (set: SetModel | null) => void
  showFallback?: boolean
  draftSet: Partial<SetModel> | null
}

export const SetTrackList: React.FC<SetTrackListProps> = ({
  step,
  sets = [],
  selectedSet,
  setSelectedSet,
  showFallback = true,
  draftSet,
}) => {
  const colors = useColors()

  const { openedWorkout } = useOpenedWorkout()
  const { showSetCompletion, previewNextSet } = useSetting()
  const updateSet = useUpdateSetQuery()

  function toggleSelectedSet(set: SetModel) {
    setSelectedSet(set.id === selectedSet?.id ? null : set)
  }

  const stepRecords = useRecordsQuery(step.id)

  const showComplete = showSetCompletion && openedWorkout?.hasIncompleteSets

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SetModel>) => {
      const isRecord = stepRecords.some(({ id }) => id === item.id)
      const isFocused = selectedSet?.id === item.id
      const isDraft = index === sets.length

      return (
        <Pressable
          style={{
            paddingHorizontal: spacing.xs,
            backgroundColor: isFocused
              ? colors.surfaceContainerHigh
              : isDraft
                ? colors.surfaceContainer
                : undefined,
          }}
          onPress={(e) => {
            e.preventDefault()
            if (!isDraft) {
              toggleSelectedSet(item)
            }
          }}
        >
          <SetTrackItem
            set={item}
            isRecord={isRecord}
            number={index + 1}
            toggleSetWarmup={toggleSetWarmup}
            draft={isDraft}
            showSetCompletion={showComplete}
          />
        </Pressable>
      )
    },
    [selectedSet, stepRecords, sets.length, colors, toggleSetWarmup, showComplete],
  )

  const flashListRef = useRef<FlashListRef<SetModel>>(null)

  function toggleSetWarmup(set: SetModel) {
    updateSet({ isWarmup: !set.isWarmup })
  }

  if (showFallback && !sets?.length && !previewNextSet)
    return <EmptyState text={translate("noSetsEntered")} />
  if (!sets?.length && !previewNextSet) return <View />

  const shouldShowDraft = !selectedSet && previewNextSet
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        setSelectedSet(null)
        Keyboard.dismiss()
      }}
    >
      <FlashList
        data={shouldShowDraft ? [...sets, draftSet as SetModel] : sets}
        renderItem={renderItem}
        keyExtractor={(set) => set.id!.toString()}
        ItemSeparatorComponent={() => (
          <Divider
            orientation="horizontal"
            variant="neutral"
          />
        )}
        contentContainerStyle={{
          paddingVertical: spacing.xs,
        }}
        ref={flashListRef}
        onContentSizeChange={() => flashListRef.current?.scrollToEnd({ animated: true })}
      />
    </Pressable>
  )
}

type SetTrackItemProps = {
  set: SetModel
  isRecord?: boolean
  number?: number
  toggleSetWarmup: (set: SetModel) => void
  draft?: boolean
  showSetCompletion?: boolean
} & View["props"]

const hideZeroRest = false

const SetTrackItem: React.FC<SetTrackItemProps> = ({
  set,
  isRecord,
  number,
  toggleSetWarmup,
  style,
  draft,
  showSetCompletion,
  ...rest
}) => {
  const colors = useColors()
  const { measureRest, previewNextSet } = useSetting()
  const color = colors.onSurface

  function getSetSymbol() {
    if (set.isWarmup) return

    return previewNextSet && draft ? "+" : String(number)
  }

  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingHorizontal: spacing.xs,
          paddingVertical: spacing.xxs,
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={{
          paddingVertical: spacing.xxs,
          gap: spacing.xs,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SetTypeButton
          icon={set.isWarmup ? "yoga" : undefined}
          onPress={() => toggleSetWarmup(set)}
          symbol={getSetSymbol()}
          color={color}
        />
        {isRecord && (
          <Icon
            icon="trophy"
            color={palettes.gold["80"]}
          />
        )}
      </View>

      {set.exercise.hasMetricType("reps") && (
        <SetDataLabel
          value={set.reps ?? 0}
          unit={translate("reps")}
        />
      )}
      {set.exercise.hasMetricType("weight") && (
        <SetDataLabel
          value={set.weight ?? 0}
          unit={set.exercise.getMetricByType("weight")!.unit}
        />
      )}
      {set.exercise.hasMetricType("distance") && (
        <SetDataLabel
          value={set.distance ?? 0}
          // value={set.distance ?? set.inferredDistance?.toFixed(2)} TODO: Why?
          unit={set.exercise.getMetricByType("distance")!.unit}
        />
      )}
      {set.exercise.hasMetricType("duration") && (
        <SetDataLabel
          value={getFormatedDuration(
            set.duration ?? 0,
            // set.duration ?? (set.inferredDuration ? +set.inferredDuration.toFixed(2) : 0), TODO: Why?
          )}
        />
      )}
      {/* {set.exercise.hasMetricType("speed") && (
        <SetDataLabel
          value={set.speed ?? set.inferredSpeed}
          unit={set.exercise.measurements.speed!.unit}
          fixDecimals
        />
      )} */}
      {/* {measureRest && (
        <SetDataLabel
          value={
            set.rest || !hideZeroRest
              ? `${translate("rest")} ${getFormatedDuration(set.rest ?? 0, true)}`
              : ""
          }
        />
      )} */}

      {/* {showSetCompletion && (
        <SetTypeButton
          icon={"check"}
          disabled={draft}
          onPress={() => {
            set.setProp("completedAt", set.completed ? null : new Date())
          }}
          color={set.completed ? color : colors.outlineVariant}
        />
      )} */}
    </View>
  )
}

type SetTypeButtonProps = {
  icon?: IconProps["icon"]
  symbol?: string
  color: string
  onPress: () => void
  disabled?: boolean
}
const SetTypeButton: React.FC<SetTypeButtonProps> = ({
  icon,
  symbol,
  color,
  onPress,
  disabled,
}) => {
  const colors = useColors()

  return (
    <Pressable
      style={{
        height: 36,
        width: 36,
        borderColor: colors.outline,
        borderWidth: 1,
        borderRadius: spacing.xxs,
        alignItems: "center",
        justifyContent: "center",
      }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
    >
      <>
        {icon ? (
          <Icon
            icon={icon}
            color={color}
          />
        ) : (
          <Text
            style={{
              fontSize: fontSize.sm,
              color,
              fontWeight: "bold",
            }}
          >
            {symbol}
          </Text>
        )}
      </>
    </Pressable>
  )
}
