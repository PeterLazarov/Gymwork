import React from 'react'
import { observer } from 'mobx-react-lite'
import { TextInput } from 'react-native-paper'
import { useStores } from 'app/db/helpers/useStores'
import { TxKeyPath, translate } from 'app/i18n'
import {
  Text,
  Header,
  FeedbackPicker,
  Icon,
  IconButton,
  useColors,
  ToggleGroupButton,
} from 'designSystem'
import { Workout, discomfortOptions, feelingOptions } from 'app/db/models'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const WorkoutFeedbackScreen: React.FC = () => {
  const colors = useColors()

  const {
    stateStore,
    navStore: { navigate },
  } = useStores()
  const workout = stateStore.openedWorkout

  function onBackPress() {
    navigate('Workout')
  }

  const rpeOptions = Array.from({ length: 6 }).map((_, i) => i + 5)
  const difficultyButtons = rpeOptions.map(option => ({
    text: String(option),
    value: String(option),
  }))

  if (!workout) {
    console.warn('REDIRECT - No workout')
    navigate('Workout')
    return null
  }

  return (
    <>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate('workoutComments')} />
      </Header>

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
            selected={workout.feeling}
            onChange={value =>
              workout.setProp('feeling', value as Workout['feeling'])
            }
            options={Object.values(feelingOptions)}
          />
          <Text>{translate('discomfort')}</Text>
          <FeedbackPicker
            selected={workout.pain}
            onChange={value =>
              workout.setProp('pain', value as Workout['pain'])
            }
            options={Object.values(discomfortOptions)}
          />
          <Text>{translate('difficulty')}</Text>
          <ToggleGroupButton
            buttons={difficultyButtons}
            initialActiveIndex={
              workout.rpe ? rpeOptions.indexOf(workout.rpe) : undefined
            }
            unselectable
            onChange={value => {
              workout.setProp('rpe', value ? Number(value) : undefined)
            }}
          />
          {workout.rpe && (
            <Text
              style={{
                color: colors.onSurface,
                textAlign: 'center',
              }}
            >
              {translate(`rpe.${workout.rpe}` as TxKeyPath)}
            </Text>
          )}

          {/* TODO fill screen. somehow */}
          <TextInput
            value={workout.notes}
            onChangeText={text => workout.setProp('notes', text)}
            multiline
            placeholder={translate('enterComments')}
            style={{
              width: '100%',
              minHeight: 100,
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  )
}
export default observer(WorkoutFeedbackScreen)
