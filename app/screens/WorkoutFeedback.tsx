import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Appbar, TextInput } from 'react-native-paper'

import FeedbackPicker from 'app/components/FeedbackPicker'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { BodyLargeLabel, Button, ButtonText, colors } from 'designSystem'

const WorkoutFeedbackPage: React.FC = () => {
  const { stateStore } = useStores()

  function onBackPress() {
    navigate('Workout')
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title="Workout comments" />
      </Appbar.Header>

      <View style={{ padding: 8, gap: 16, flex: 1 }}>
        <BodyLargeLabel style={{ textAlign: 'center' }}>
          How was the workout?
        </BodyLargeLabel>
        <FeedbackPicker
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
            placeholder="Enter comments..."
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
          <ButtonText variant="primary">Save</ButtonText>
        </Button>
      </View>
    </View>
  )
}
export default observer(WorkoutFeedbackPage)
