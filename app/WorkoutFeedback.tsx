import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Appbar, TextInput, Button } from 'react-native-paper'

import FeedbackPicker from '../components/FeedbackPicker'
import { useStores } from '../db/helpers/useStores'
import { SectionLabel } from '../designSystem/Label'

const WorkoutPage: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  function onBackPress() {
    router.push('/')
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title="Workout comments" />
      </Appbar.Header>

      <View style={{ padding: 8, gap: 16, flex: 1 }}>
        <SectionLabel>How was the workout?</SectionLabel>
        <FeedbackPicker
          onChange={feeling =>
            workoutStore.currentWorkout!.setProp('feeling', feeling)
          }
        />
        <ScrollView>
          <TextInput
            value={workoutStore.currentWorkout?.notes}
            onChangeText={text =>
              workoutStore.currentWorkout!.setProp('notes', text)
            }
            multiline
            placeholder="Enter comments..."
          />
        </ScrollView>
        <Button
          mode="contained"
          onPress={onBackPress}
        >
          Continue
        </Button>
      </View>
    </View>
  )
}
export default observer(WorkoutPage)
