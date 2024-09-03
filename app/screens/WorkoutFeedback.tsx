import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { TextInput } from 'react-native-paper'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import FeedbackPicker from 'app/components/FeedbackPicker'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Header,
  Icon,
  IconButton,
  colors,
  fontSize,
} from 'designSystem'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'

const WorkoutFeedbackScreen: React.FC = () => {
  const { stateStore } = useStores()

  const screenWidth = Dimensions.get('window').width

  function onBackPress() {
    navigate('Workout')
  }

  return (
    <EmptyLayout style={{ backgroundColor: colors.lightgray }}>
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
            textAlign: 'center',
          }}
        >
          {translate('howWasWorkout')}
        </Text>
        <FeedbackPicker
          selected={stateStore.openedWorkout!.feeling}
          onChange={feeling =>
            stateStore.openedWorkout!.setProp('feeling', feeling)
          }
        />

        <Text
          style={{
            fontSize: fontSize.md,
            textAlign: 'center',
          }}
        >
          {`${translate('exhaustion')} - ${
            stateStore.openedWorkout!.exhaustion
          }`}
        </Text>
        <MultiSlider
          values={[stateStore.openedWorkout!.exhaustion]}
          sliderLength={screenWidth - 40}
          onValuesChange={([value]) =>
            stateStore.openedWorkout!.setProp('exhaustion', value)
          }
          min={1}
          max={10}
          snapped
          selectedStyle={{
            backgroundColor: colors.primary,
          }}
        />
        <TextInput
          value={stateStore.openedWorkout!.notes}
          onChangeText={text =>
            stateStore.openedWorkout!.setProp('notes', text)
          }
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
