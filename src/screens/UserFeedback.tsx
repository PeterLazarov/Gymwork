import React, { useState } from "react"
import { View } from "react-native"
import { DateTime } from "luxon"

import { Button, Header, Icon, IconButton, spacing, useColors } from "@/designSystem"
import {
  AppStackParamList,
  AppStackScreenProps,
  useRouteParams,
} from "@/navigators/navigationTypes"
import { useDialogContext } from "@/context/DialogContext"
import { BaseLayout } from "@/layouts/BaseLayout"
import { translate } from "@/utils"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useSetting } from "@/context/SettingContext"
import { AirtableFeedback, airtableApi } from "@/integrations/airtable"
import { HelperText, TextInput } from "react-native-paper"

export type UserFeedbackScreenParams = {
  referrerPage: keyof AppStackParamList
}
interface UserFeedbackScreenProps extends AppStackScreenProps<"UserFeedback"> {}

export const UserFeedbackScreen: React.FC<UserFeedbackScreenProps> = ({ navigation }) => {
  const { referrerPage } = useRouteParams("UserFeedback")

  const { openedDate } = useOpenedWorkout()
  const { feedbackUser, setFeedbackUser } = useSetting()
  const { showSnackbar } = useDialogContext()

  const colors = useColors()

  const [feedback, setFeedback] = useState<AirtableFeedback>({
    date: openedDate,
    user: feedbackUser,
    comments: "",
    createdAt: DateTime.now().toISO(),
  })
  const [formValid, setFormValid] = useState(false)

  function onUpdate(updated: AirtableFeedback, isValid: boolean) {
    setFeedback(updated)
    setFormValid(isValid)
    setFeedbackUser(updated.user)
  }

  function onFeedbackSave() {
    navigation.goBack()
    showSnackbar?.({
      text: "Thank you for sending us feedback",
    })

    const feedbackWithReferrer = {
      ...feedback,
      comments: `${feedback.comments}\n\nPage:${referrerPage}`,
    }

    airtableApi.sendFeedback(feedbackWithReferrer)
  }

  return (
    <BaseLayout>
      <Header>
        <IconButton
          onPress={navigation.goBack}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title="Feedback" />
        <IconButton
          onPress={onFeedbackSave}
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

      <View style={[{ flex: 1 }]}>
        <UserFeedbackForm
          feedback={feedback}
          onUpdate={onUpdate}
        />
      </View>
      <Button
        variant="primary"
        onPress={onFeedbackSave}
        disabled={!formValid}
        text={translate("save")}
      />
    </BaseLayout>
  )
}

type UserFeedbackFormProps = {
  feedback: AirtableFeedback
  onUpdate: (updated: AirtableFeedback, isValid: boolean) => void
}

const UserFeedbackForm: React.FC<UserFeedbackFormProps> = ({ feedback, onUpdate }) => {
  const [nameError, setNameError] = useState("")
  const [commentsError, setCommentsError] = useState("")

  function runValidCheck(data: AirtableFeedback) {
    const nameInvalid = data.user.trim() === ""
    const commentsInvalid = data.comments.trim() === ""

    setNameError(nameInvalid ? "Please enter your name." : "")
    setCommentsError(commentsInvalid ? "We need your comments." : "")

    return !(nameInvalid || commentsInvalid)
  }

  function onPropChange(field: keyof AirtableFeedback, value: string) {
    const newData = {
      ...feedback,
      [field]: value,
    }
    const isValid = runValidCheck(newData)
    onUpdate(newData, isValid)
  }

  return (
    <View style={{ flex: 1, gap: spacing.sm, padding: spacing.sm }}>
      <TextInput
        label="Name"
        value={feedback.user}
        onChangeText={(text) => onPropChange("user", text)}
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
      <TextInput
        label="Comments"
        placeholder="Comments"
        value={feedback.comments}
        multiline
        style={{
          minHeight: 200,
        }}
        onChangeText={(text) => onPropChange("comments", text)}
        error={commentsError !== ""}
      />
      {commentsError !== "" && (
        <HelperText
          type="error"
          visible={commentsError !== ""}
        >
          {commentsError}
        </HelperText>
      )}
    </View>
  )
}
