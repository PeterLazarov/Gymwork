import type { StaticScreenProps } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import UserFeedbackForm from 'app/components/UserFeedbackForm'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Screen } from '@/components/ignite'
import { AirtableFeedback, airtableApi } from 'app/services/airtable'
import {
  Button,
  ButtonText,
  HeaderRight,
  HeaderTitle,
  Icon,
  IconButton,
} from 'designSystem'

export type UserFeedbackScreenProps = StaticScreenProps<{
  referrerPage: string
}>
export const UserFeedbackScreen: React.FC<UserFeedbackScreenProps> = observer(
  ({ route }) => {
    const { referrerPage } = route.params

    const {
      stateStore,
      navStore: { goBack },
    } = useStores()

    const { showSnackbar } = useDialogContext()

    const {
      theme: { colors },
    } = useAppTheme()

    const [feedback, setFeedback] = useState<AirtableFeedback>({
      date: stateStore.openedDate,
      user: stateStore.feedbackUser,
      comments: '',
      createdAt: DateTime.now().toISO(),
    })
    const [formValid, setFormValid] = useState(false)

    function onUpdate(updated: AirtableFeedback, isValid: boolean) {
      setFeedback(updated)
      setFormValid(isValid)
      stateStore.setProp('feedbackUser', updated.user)
    }

    function onFeedbackSave() {
      goBack()
      showSnackbar?.({
        text: 'Thank you for sending us feedback',
      })

      const feedbackWithReferrer = {
        ...feedback,
        comments: `${feedback.comments}\n\nPage:${referrerPage}`,
      }

      airtableApi.sendFeedback(feedbackWithReferrer)
    }

    return (
      <>
        <Screen
          safeAreaEdges={['top', 'bottom']}
          contentContainerStyle={{ flex: 1, paddingTop: 32 }} // TODO why does this go under the header?
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <UserFeedbackForm
              feedback={feedback}
              onUpdate={onUpdate}
            />
          </View>

          <Button
            variant="primary"
            onPress={onFeedbackSave}
            disabled={!formValid}
          >
            <ButtonText variant="primary">{translate('save')}</ButtonText>
          </Button>
        </Screen>

        <HeaderTitle title="Feedback" />
        <HeaderRight>
          <IconButton
            onPress={onFeedbackSave}
            disabled={!formValid}
          >
            <Icon
              icon="checkmark"
              color={colors.onPrimary}
            />
          </IconButton>
        </HeaderRight>
      </>
    )
  }
)
