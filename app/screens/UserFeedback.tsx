import React, { useState } from 'react'
import { observable } from 'mobx'
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
  })
  const [formValid, setFormValid] = useState(false)

  function onUpdate(updated: AirtableFeedback, isValid: boolean) {
    setFeedback(updated)
    setFormValid(isValid)
    stateStore.setProp('feedbackUser', updated.user)
  }

  function onFeedbackSave() {
    airtableApi.sendFeedback(feedback).then(() => {
      goBack()
      showSnackbar!({
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
          disabled={!formValid}
        >
          <ButtonText variant="primary">{translate('save')}</ButtonText>
        </Button>
      </KeyboardAvoiderView>
    </EmptyLayout>
  )
}

export default observable(UserFeedbackScreen)
