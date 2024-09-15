import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { TxKeyPath, translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Header,
  FeedbackPicker,
  Icon,
  IconButton,
  useColors,
  fontSize,
  ToggleGroupButton,
} from 'designSystem'
import { Workout, painOptions, feelingOptions } from 'app/db/models'

const WorkoutFeedbackScreen: React.FC = () => {
  const colors = useColors()

  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout!

  function onBackPress() {
    navigate('Workout')
  }

  const rpeOptions = Array.from({ length: 6 }).map((_, i) => i + 5)
  const difficultyButtons = rpeOptions.map(option => ({
    text: String(option),
    onPress: () => {
      workout.setProp('rpe', option)
    },
  }))

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
            color: colors.tertiaryText,
          }}
        >
          {translate('howWasWorkout')}
        </Text>
        <FeedbackPicker
          selected={workout.feeling}
          onChange={value =>
            workout.setProp('feeling', value as Workout['feeling'])
          }
          options={Object.values(feelingOptions)}
        />
        <Text
          style={{
            fontSize: fontSize.md,
            color: colors.tertiaryText,
          }}
        >
          {translate('experiencedPain')}
        </Text>
        <FeedbackPicker
          selected={workout.pain}
          onChange={value => workout.setProp('pain', value as Workout['pain'])}
          options={Object.values(painOptions)}
        />
        <Text
          style={{
            fontSize: fontSize.md,
            color: colors.tertiaryText,
          }}
        >
          {translate('difficulty')}
        </Text>
        <ToggleGroupButton
          buttons={difficultyButtons}
          initialActiveIndex={
            workout.rpe ? rpeOptions.indexOf(workout.rpe) : undefined
          }
          containerStyle={{ padding: 10 }}
        />
        {workout.rpe && (
          <Text
            style={{
              fontSize: fontSize.md,
              color: colors.tertiaryText,
              textAlign: 'center',
            }}
          >
            {translate(`rpe.${workout.rpe}` as TxKeyPath)}
          </Text>
        )}
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
