import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  Text,
  FeedbackPicker,
  ToggleGroupButton,
  useColors,
} from 'designSystem'
import {
  WorkoutComments,
  discomfortOptions,
  feelingOptions,
} from 'app/db/models'
import { TxKeyPath, translate } from 'app/i18n'

type Props = {
  comments: WorkoutComments
  onUpdate: (updated: WorkoutComments) => void
}

const WorkoutCommentsForm: React.FC<Props> = ({ comments, onUpdate }) => {
  const colors = useColors()

  const rpeOptions = Array.from({ length: 6 }).map((_, i) => i + 5)
  const difficultyButtons = rpeOptions.map(option => ({
    text: String(option),
    value: String(option),
  }))

  return (
    <KeyboardAwareScrollView extraScrollHeight={100}>
      <View
        style={{
          padding: 8,
          gap: 16,
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Text>{translate('howWasWorkout')}</Text>
        <FeedbackPicker
          selected={comments.feeling}
          onChange={value =>
            onUpdate({
              ...comments,
              feeling: value as WorkoutComments['feeling'],
            })
          }
          options={Object.values(feelingOptions)}
        />
        <Text>{translate('discomfort')}</Text>
        <FeedbackPicker
          selected={comments.pain}
          onChange={value =>
            onUpdate({
              ...comments,
              pain: value as WorkoutComments['pain'],
            })
          }
          options={Object.values(discomfortOptions)}
        />
        <Text>{translate('difficulty')}</Text>
        <ToggleGroupButton
          buttons={difficultyButtons}
          initialActiveIndex={
            comments.rpe ? rpeOptions.indexOf(comments.rpe) : undefined
          }
          unselectable
          onChange={value => {
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
              textAlign: 'center',
            }}
          >
            {translate(`rpe.${comments.rpe}` as TxKeyPath)}
          </Text>
        )}

        {/* TODO fill screen. somehow */}
        <TextInput
          value={comments.notes}
          onChangeText={text =>
            onUpdate({
              ...comments,
              notes: text,
            })
          }
          multiline
          placeholder={translate('enterComments')}
          style={{
            width: '100%',
            minHeight: 100,
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}
export default observer(WorkoutCommentsForm)
