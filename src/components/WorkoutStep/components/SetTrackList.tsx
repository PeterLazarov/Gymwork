import { FlashList, FlashListRef, ListRenderItemInfo } from "@shopify/flash-list"
import { useCallback, useRef } from "react"
import { Keyboard, Pressable, View } from "react-native"

import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useSetting } from "@/context/SettingContext"
import { useRecords, useSettings, useUpdateSet } from "@/db/hooks"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
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
import { DateTime } from "luxon"
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
  const { data: settings } = useSettings()
  const { mutate: updateSet } = useUpdateSet()

  function toggleSelectedSet(set: SetModel) {
    setSelectedSet(set.id === selectedSet?.id ? null : set)
  }

  const { data: records } = useRecords(step.id)

  const showComplete = settings?.manual_set_completion && openedWorkout?.hasIncompleteSets

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SetModel>) => {
      const record = records?.find(({ id }) => id === item.id)
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
            isRecord={!!record && !record.isWeakAss}
            number={step.setsNumberMap[item.id!]}
            toggleSetWarmup={toggleSetWarmup}
            toggleCompleted={toggleSetCompletion}
            draft={isDraft}
            showComplete={showComplete}
          />
        </Pressable>
      )
    },
    [selectedSet, records, sets.length, colors, toggleSetWarmup, showComplete],
  )

  const flashListRef = useRef<FlashListRef<SetModel>>(null)

  function toggleSetWarmup(set: SetModel) {
    updateSet({ setId: set.id!, updates: { isWarmup: !set.isWarmup } })
  }
  function toggleSetCompletion(set: SetModel) {
    updateSet({
      setId: set.id!,
      updates: { completedAt: set.completedAt ? null : DateTime.now().toMillis() },
    })
  }

  if (showFallback && !sets?.length && !settings?.preview_next_set)
    return <EmptyState text={translate("noSetsEntered")} />
  if (!sets?.length && !settings?.preview_next_set) return <View />

  const shouldShowDraft = !selectedSet && settings?.preview_next_set && draftSet
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
        keyExtractor={(set, index) => (index === sets.length ? "draft" : set.id.toString())}
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
  toggleCompleted: (set: SetModel) => void
  draft?: boolean
  showComplete?: boolean
} & View["props"]

const SetTrackItem: React.FC<SetTrackItemProps> = ({
  set,
  isRecord,
  number,
  toggleSetWarmup,
  toggleCompleted,
  style,
  draft,
  showComplete,
  ...rest
}) => {
  const colors = useColors()
  const { measureRest, previewNextSet } = useSetting()

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
          paddingHorizontal: spacing.xs,
          paddingVertical: spacing.xxs,
          gap: spacing.xs,
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
          flex: 1,
        }}
      >
        <SetTypeButton
          icon={set.isWarmup ? "yoga" : undefined}
          onPress={() => {
            if (!draft) {
              toggleSetWarmup(set)
            }
          }}
          symbol={getSetSymbol()}
          color={colors.onSurface}
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
          unit={set.exercise.getMetricByType("reps")!.unit}
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
      {measureRest && (
        <SetDataLabel
          value={getFormatedDuration(set.rest ?? 0, true)}
          unit={translate("rest")}
        />
      )}

      {showComplete && (
        <SetTypeButton
          icon={"check"}
          disabled={draft}
          onPress={() => toggleCompleted(set)}
          color={set.completedAt ? colors.primary : colors.outline}
        />
      )}
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
