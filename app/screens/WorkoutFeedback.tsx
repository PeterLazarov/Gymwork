import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { TextInput } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Header,
  FeedbackPicker,
  Icon,
  IconButton,
  useColors,
  fontSize,
  Slider,
} from 'designSystem'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { Workout, painOptions, feelingOptions } from 'app/db/models'

const WorkoutFeedbackScreen: React.FC = () => {
  const colors = useColors()

  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout!

  function onBackPress() {
    navigate('Workout')
  }

  const screenWidth = Dimensions.get('window').width

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
          {workout.rpe !== undefined
            ? translate('rpeValue', { rate: workout.rpe })
            : translate('rpe')}
        </Text>
        <Slider
          values={workout.rpe !== undefined ? [workout.rpe] : []}
          sliderLength={screenWidth - 40}
          onValuesChange={([value]) => workout.setProp('rpe', value)}
          min={1}
          max={10}
          snapped
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
