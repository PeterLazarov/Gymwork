import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Header,
  FeedbackPicker,
  Icon,
  IconButton,
  colorSchemas,
  colors,
  fontSize,
} from 'designSystem'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { Workout } from 'app/db/models'

const WorkoutFeedbackScreen: React.FC = () => {
  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout!

  function onBackPress() {
    navigate('Workout')
  }

  const workoutOptions = [
    {
      icon: 'emoji-sad',
      label: 'Bad',
      color: colorSchemas.coral.hue600,
      value: 'sad',
    },
    {
      icon: 'emoji-happy',
      label: 'Good',
      color: colorSchemas.amber.hue600,
      value: 'neutral',
    },
    {
      icon: 'grin-stars',
      label: 'Great',
      color: colorSchemas.green.hue600,
      value: 'happy',
    },
  ]

  const painOptions = [
    {
      icon: 'alert-decagram-outline',
      label: 'Pain',
      color: colorSchemas.coral.hue600,
      value: 'pain',
    },
    {
      icon: 'warning-outline',
      label: 'Discomfort',
      color: colorSchemas.amber.hue600,
      value: 'discomfort',
    },
    {
      icon: 'check',
      label: 'No pain',
      color: colorSchemas.green.hue600,
      value: 'noPain',
    },
  ]
  const exhaustionOptions = [
    {
      icon: 'sleep',
      // icon: 'star-outline',
      // icon: 'speedometer-slow',
      label: 'Easy',
      color: colorSchemas.coral.hue600,
      value: 'easy',
    },
    {
      icon: 'star',
      // icon: 'speedometer-medium',
      label: 'Standard',
      color: colorSchemas.amber.hue600,
      value: 'standard',
    },
    {
      icon: 'flame',
      // icon: 'speedometer',
      label: 'Intense',
      color: colorSchemas.green.hue600,
      value: 'intense',
    },
  ]
  return (
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.primaryText}
          />
        </IconButton>
        <Header.Title title={translate('workoutComments')} />
      </Header>

      <KeyboardAvoiderView
        avoidMode="focused-input"
        style={{
          padding: 8,
          gap: 16,
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: fontSize.md,
          }}
        >
          {translate('howWasWorkout')}
        </Text>
        <FeedbackPicker
          selected={workout.feeling}
          onChange={value =>
            workout.setProp('feeling', value as Workout['feeling'])
          }
          options={workoutOptions}
        />
        <Text
          style={{
            fontSize: fontSize.md,
          }}
        >
          {translate('experiencedPain')}
        </Text>
        <FeedbackPicker
          selected={workout.pain}
          onChange={value => workout.setProp('pain', value as Workout['pain'])}
          options={painOptions}
        />
        <Text
          style={{
            fontSize: fontSize.md,
          }}
        >
          {translate('intensity')}
        </Text>

        <FeedbackPicker
          selected={workout.intensity}
          onChange={value =>
            workout.setProp('intensity', value as Workout['intensity'])
          }
          options={exhaustionOptions}
        />
        <TextInput
          value={workout.notes}
          onChangeText={text => workout.setProp('notes', text)}
          multiline
          placeholder={translate('enterComments')}
          style={{
            width: '100%',
          }}
        />
      </KeyboardAvoiderView>

      <View
        style={{
          backgroundColor: colors.primary,
        }}
      >
        <Button
          variant="primary"
          onPress={onBackPress}
        >
          <ButtonText variant="primary">{translate('done')}</ButtonText>
        </Button>
      </View>
    </EmptyLayout>
  )
}
export default observer(WorkoutFeedbackScreen)
