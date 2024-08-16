import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Appbar, TextInput } from 'react-native-paper'

import FeedbackPicker from 'app/components/FeedbackPicker'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { translate } from 'app/i18n'
import { BodyLargeLabel, Button, ButtonText, colors } from 'designSystem'

const WorkoutFeedbackPage: React.FC = () => {
  const { stateStore } = useStores()

  function onBackPress() {
    navigate('Workout')
  }

  return (
    <EmptyLayout style={{ backgroundColor: colors.lightgray }}>
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={translate('workoutComments')} />
      </Appbar.Header>

      <View style={{ padding: 8, gap: 16, flex: 1 }}>
        <BodyLargeLabel style={{ textAlign: 'center' }}>
          {translate('howWasWorkout')}
        </BodyLargeLabel>
        <FeedbackPicker
          selected={stateStore.openedWorkout!.feeling}
          onChange={feeling =>
            stateStore.openedWorkout!.setProp('feeling', feeling)
          }
        />
        <ScrollView>
          <TextInput
            value={stateStore.openedWorkout?.notes}
            onChangeText={text =>
              stateStore.openedWorkout!.setProp('notes', text)
            }
            multiline
            placeholder={translate('enterComments')}
          />
        </ScrollView>
      </View>

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
export default observer(WorkoutFeedbackPage)
