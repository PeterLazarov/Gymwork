import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'
import { spacing } from 'designSystem'

import { AirtableFeedback } from 'app/services/airtable'

type Props = {
  feedback: AirtableFeedback
  onUpdate: (updated: AirtableFeedback, isValid: boolean) => void
}

const UserFeedbackForm: React.FC<Props> = ({ feedback, onUpdate }) => {
  const [nameError, setNameError] = useState('')
  const [commentsError, setCommentsError] = useState('')

  function runValidCheck(data: AirtableFeedback) {
    const nameInvalid = data.user.trim() === ''
    const commentsInvalid = data.comments.trim() === ''

    setNameError(nameInvalid ? 'Please enter your name.' : '')
    setCommentsError(commentsInvalid ? 'We need your comments.' : '')

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
        onChangeText={text => onPropChange('user', text)}
        error={nameError !== ''}
      />
      {nameError !== '' && (
        <HelperText
          type="error"
          visible={nameError !== ''}
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
        onChangeText={text => onPropChange('comments', text)}
        error={commentsError !== ''}
      />
      {commentsError !== '' && (
        <HelperText
          type="error"
          visible={commentsError !== ''}
        >
          {commentsError}
        </HelperText>
      )}
    </View>
  )
}
export default observer(UserFeedbackForm)
