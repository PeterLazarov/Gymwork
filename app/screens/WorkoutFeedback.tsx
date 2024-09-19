import { observer } from 'mobx-react-lite'
import React from 'react'
import { TextInput } from 'react-native-paper'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'

import { useStores } from 'app/db/helpers/useStores'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
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
import { ScrollView, View } from 'react-native'

const WorkoutFeedbackScreen: React.FC = () => {
  const colors = useColors()

  const {
    stateStore,
    navStore: { navigate },
  } = useStores()
  const workout = stateStore.openedWorkout

  if (!workout) {
    console.warn('REDIRECT - No workout')
    navigate('Workout')
    return null
  }

  function onBackPress() {
    navigate('Workout')
  }

  const rpeOptions = Array.from({ length: 6 }).map((_, i) => i + 5)
  const difficultyButtons = rpeOptions.map(option => ({
    text: String(option),
    value: String(option),
  }))

  // DUMB FIX
  if (!workout) {
    navigate('Workout')
  }

  return (
    <EmptyLayout>
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

      <KeyboardAvoiderView
        avoidMode="focused-input"
        style={{ flex: 1 }}
      >
        <ScrollView>
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
        </ScrollView>
      </KeyboardAvoiderView>
    </EmptyLayout>
  )
}
export default observer(WorkoutFeedbackScreen)
