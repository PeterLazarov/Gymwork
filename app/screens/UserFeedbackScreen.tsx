import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'

import UserFeedbackForm from 'app/components/UserFeedbackForm'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { useRouteParams } from 'app/navigators'
import { AirtableFeedback, airtableApi } from 'app/services/airtable'
import { Button, ButtonText, Header, Icon, IconButton } from 'designSystem'

export const UserFeedbackScreen: React.FC = observer(() => {
  const { referrerPage } = useRouteParams('UserFeedback')

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
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={goBack}
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

      <View style={{ flex: 1 }}>
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
    </EmptyLayout>
  )
})
