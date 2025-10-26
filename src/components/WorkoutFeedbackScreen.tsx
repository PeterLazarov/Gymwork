import { discomfortOptions, feelingOptions } from "@/constants/enums"
import { useDialogContext } from "@/context/DialogContext"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutComments } from "@/db/models/WorkoutModel"
import { useUpdateWorkoutQuery } from "@/db/queries/useUpdateWorkoutQuery"
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
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { translate, TxKeyPath } from "@/utils"
import { useState } from "react"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { TextInput } from "react-native-paper"

interface WorkoutFeedbackScreenProps extends AppStackScreenProps<"WorkoutFeedback"> {}

export const WorkoutFeedbackScreen: React.FC<WorkoutFeedbackScreenProps> = ({ navigation }) => {
  const colors = useColors()
  const { openedWorkout } = useOpenedWorkout()
  const updateWorkout = useUpdateWorkoutQuery()
  const { showConfirm } = useDialogContext()
  const [comments, setComments] = useState<WorkoutComments>(openedWorkout!.comments)

  if (!openedWorkout) {
    console.warn("REDIRECT - No workout")
    navigation.goBack()
    return null
  }
  function onBackPress() {
    showConfirm?.({
      message: translate("changesWillBeLost"),
      onClose: () => showConfirm?.(undefined),
      onConfirm: onBackConfirmed,
    })
  }

  function onBackConfirmed() {
    showConfirm?.(undefined)
    navigation.goBack()
  }

  function onCommentsSave() {
    updateWorkout(openedWorkout!.id, { ...comments })
    navigation.goBack()
  }

  return (
    <>
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
        onUpdate={setComments}
      />

      <Button
        variant="primary"
        onPress={onCommentsSave}
        text={translate("save")}
      />
    </>
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
    <KeyboardAwareScrollView extraKeyboardSpace={100}>
      <View
        style={{
          padding: spacing.xs,
          gap: spacing.md,
          flex: 1,
          width: "100%",
          alignItems: "center",
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

        {/* TODO fill screen. somehow */}
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
