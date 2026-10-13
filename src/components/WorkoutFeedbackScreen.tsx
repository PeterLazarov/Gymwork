import { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller"
import { TextInput } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { discomfortOptions, feelingOptions } from "@/constants/enums"
import { useDialogContext } from "@/context/DialogContext"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useUpdateWorkout } from "@/db/hooks"
import { WorkoutComments } from "@/db/models/WorkoutModel"
import {
  Button,
  FeedbackPicker,
  Header,
  Icon,
  IconButton,
  spacing,
  Text,
  ToggleGroupButton,
  useColors,
} from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { goBack } from "@/navigators/navigationUtilities"
import { translate, TxKeyPath } from "@/utils"

export const WorkoutFeedbackScreen: React.FC = () => {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const { openedWorkout } = useOpenedWorkout()
  const { mutate: updateWorkout } = useUpdateWorkout()
  const { showConfirm } = useDialogContext()
  const [comments, setComments] = useState<WorkoutComments>(
    () => openedWorkout?.comments ?? { name: "", notes: "" },
  )
  const hasChanges = useRef(false)

  // Should never happen (e.g. nav-state restore without an opened workout):
  // just leave instead of rendering a fallback UI.
  useEffect(() => {
    if (!openedWorkout) goBack()
  }, [openedWorkout])

  if (!openedWorkout) return null

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

  function onCommentsSave() {
    updateWorkout({
      workoutId: openedWorkout!.id,
      workout: { ...comments },
      date: openedWorkout!.date,
    })
    goBack()
  }

  return (
    <BaseLayout disableKeyboardAvoiding>
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
        <Header.Title title={translate("workoutComments")} />
        <IconButton
          onPress={onCommentsSave}
          underlay="darker"
        >
          <Icon
            icon="checkmark"
            size="large"
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>

      <CommentsForm
        comments={comments}
        onUpdate={(updated) => {
          hasChanges.current = true
          setComments(updated)
        }}
      />

      <KeyboardStickyView offset={{ opened: insets.bottom }}>
        <Button
          variant="primary"
          onPress={onCommentsSave}
          text={translate("save")}
        />
      </KeyboardStickyView>
    </BaseLayout>
  )
}

type CommentsFormProps = {
  comments: WorkoutComments
  onUpdate: (updated: WorkoutComments) => void
}

const CommentsForm: React.FC<CommentsFormProps> = ({ comments, onUpdate }) => {
  const colors = useColors()

  const rpeOptions = Array.from({ length: 6 }).map((_, i) => i + 5)
  const difficultyButtons = rpeOptions.map((option) => ({
    text: String(option),
    value: String(option),
  }))

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 64 }}
      // Keep the focused input just above the sticky Save footer (48px)
      // with a small gap. A small extraKeyboardSpace avoids the jump
      // caused by excessive values.
      bottomOffset={112}
      extraKeyboardSpace={16}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          padding: spacing.xs,
          gap: spacing.md,
          flex: 1,
          width: "100%",
        }}
      >
        <Text>{translate("name")}</Text>
        <TextInput
          value={comments.name}
          onChangeText={(text) =>
            onUpdate({
              ...comments,
              name: text,
            })
          }
        />
        <Text>{translate("howWasWorkout")}</Text>
        <FeedbackPicker
          selected={comments.feeling}
          onChange={(value) =>
            onUpdate({
              ...comments,
              feeling: value as WorkoutComments["feeling"],
            })
          }
          options={Object.values(feelingOptions)}
        />
        <Text>{translate("discomfort")}</Text>
        <FeedbackPicker
          selected={comments.pain}
          onChange={(value) =>
            onUpdate({
              ...comments,
              pain: value as WorkoutComments["pain"],
            })
          }
          options={Object.values(discomfortOptions)}
        />
        <Text>{translate("difficulty")}</Text>
        <ToggleGroupButton
          buttons={difficultyButtons}
          initialActiveIndex={comments.rpe ? rpeOptions.indexOf(comments.rpe) : undefined}
          unselectable
          onChange={(value) => {
            onUpdate({
              ...comments,
              rpe: value ? Number(value) : undefined,
            })
          }}
        />
        {comments.rpe && (
          <Text
            style={{
              color: colors.onSurface,
              textAlign: "center",
            }}
          >
            {translate(`rpe.${comments.rpe}` as TxKeyPath)}
          </Text>
        )}

        <TextInput
          value={comments.notes}
          onChangeText={(text) =>
            onUpdate({
              ...comments,
              notes: text,
            })
          }
          multiline
          placeholder={translate("enterComments")}
          style={{
            width: "100%",
            minHeight: 100,
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}
