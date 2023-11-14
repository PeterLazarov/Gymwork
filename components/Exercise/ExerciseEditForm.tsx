import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput, IconButton } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Icon } from '../../designSystem'
import MultiselectWrapper from '../../designSystem/Multiselect'

const ExerciseEditForm: React.FC = () => {
  const { openedExercise, exerciseStore } = useStores()

  const [weightIncrement, setWeightIncrement] = useState(
    `${openedExercise!.weightIncrement}`
  )
  function handleNumericChange(text: string) {
    // Remove non-numeric characters using a regular expression
    const sanitizedValue = text.replace(/[^0-9.]/g, '')
    setWeightIncrement(sanitizedValue)
    openedExercise!.setProp('weightIncrement', Number(sanitizedValue))
  }

  function onMusclesChange(selected: string[]) {
    if (selected.length > 0) {
      openedExercise!.setProp('muscles', selected)
    }
  }

  function onAddMusclePress() {
    // Todo: route to muscle create
  }

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <TextInput
        value={openedExercise!.name}
        onChangeText={text => openedExercise!.setProp('name', text)}
        label="Name"
      />
      <TextInput
        value={weightIncrement}
        keyboardType="decimal-pad"
        onChangeText={handleNumericChange}
        label="Weight Increment"
      />
      <View style={{ flexDirection: 'row' }}>
        <MultiselectWrapper
          options={exerciseStore.muscleOptions}
          selectedOptions={openedExercise!.muscles}
          onSelect={onMusclesChange}
          containerStyle={{ flex: 1 }}
          selectText="Muscle areas"
        />
        <IconButton
          icon={() => <Icon icon="add" />}
          onPress={onAddMusclePress}
        />
      </View>
      <Text>TODO: Measurement Type</Text>
      <Text>TODO: Measurement Unit Type</Text>
    </View>
  )
}
export default observer(ExerciseEditForm)
