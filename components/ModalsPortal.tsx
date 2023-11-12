import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { View } from 'react-native'
import { Modal, Portal, Button, TextInput } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { HeadingLabel } from '../designSystem/Label'

const ModalsPortal = () => {
  const { workoutStore } = useStores()
  const [notes, setNotes] = useState(workoutStore.currentWorkout?.notes)

  const hideModal = () => workoutStore.setProp('notesDialogOpen', false)
  const saveChanges = () => {
    workoutStore.setWorkoutNotes(notes?.trim() ?? '')
    hideModal()
  }
  const containerStyle = { backgroundColor: 'white', padding: 20 }

  return (
    <Portal>
      <Modal
        visible={workoutStore.notesDialogOpen}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <HeadingLabel style={{ marginBottom: 24 }}>
          Workout Comment
        </HeadingLabel>
        <View style={{ marginBottom: 12 }}>
          <TextInput
            value={notes}
            numberOfLines={4}
            onChangeText={text => setNotes(text)}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            onPress={hideModal}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            onPress={saveChanges}
            style={{ flex: 1 }}
          >
            Save
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

export default observer(ModalsPortal)
