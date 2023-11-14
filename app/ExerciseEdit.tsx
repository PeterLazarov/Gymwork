import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Appbar, Button } from 'react-native-paper'

import ExerciseEditForm from '../components/Exercise/ExerciseEditForm'
import { Icon } from '../designSystem'

const ExerciseEditPage: React.FC = () => {
  const router = useRouter()

  function onBackPress() {
    router.back()
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title="Update exercise" />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={onBackPress}
          animated={false}
        />
      </Appbar.Header>
      <View style={{ flex: 1, gap: 8, padding: 8 }}>
        <ExerciseEditForm />
        <Button
          mode="contained"
          onPress={onBackPress}
        >
          Done
        </Button>
      </View>
    </View>
  )
}
export default observer(ExerciseEditPage)
