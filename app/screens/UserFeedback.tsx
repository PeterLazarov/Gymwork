import React, { useState } from 'react'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'

import { EmptyLayout } from 'app/layouts/EmptyLayout'
import {
  Button,
  ButtonText,
  Header,
  Icon,
  IconButton,
  useColors,
} from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import { AirtableFeedback, airtableApi } from 'app/services/airtable'
import { useDialogContext } from 'app/contexts/DialogContext'
import { translate } from 'app/i18n'
import UserFeedbackForm from 'app/components/UserFeedbackForm'
import { observer } from 'mobx-react-lite'
import { DateTime } from 'luxon'

const UserFeedbackScreen: React.FC = () => {
  const {
    stateStore,
    navStore: { goBack },
  } = useStores()

  const { showSnackbar } = useDialogContext()

  const colors = useColors()

  const [feedback, setFeedback] = useState<AirtableFeedback>({
    date: stateStore.openedDate,
    user: stateStore.feedbackUser,
    comments: '',
    createdAt: DateTime.now().toISO(),
  })
  const [formValid, setFormValid] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function onUpdate(updated: AirtableFeedback, isValid: boolean) {
    setFeedback(updated)
    setFormValid(isValid)
    stateStore.setProp('feedbackUser', updated.user)
  }

  function onFeedbackSave() {
    setSubmitting(true)
    airtableApi.sendFeedback(feedback).then(() => {
      setSubmitting(false)
      goBack()
      showSnackbar?.({
        text: 'Thank you for sending us feedback',
      })
    })
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
          disabled={!formValid || submitting}
          underlay="darker"
        >
          <Icon
            icon="checkmark"
            size="large"
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>
      <KeyboardAvoiderView
        avoidMode="focused-input"
        style={{ flex: 1 }}
      >
        <UserFeedbackForm
          feedback={feedback}
          onUpdate={onUpdate}
        />
        <Button
          variant="primary"
          onPress={onFeedbackSave}
          disabled={!formValid || submitting}
        >
          <ButtonText variant="primary">{translate('save')}</ButtonText>
        </Button>
      </KeyboardAvoiderView>
    </EmptyLayout>
  )
}

export default observer(UserFeedbackScreen)
