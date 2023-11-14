import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput, IconButton } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Exercise } from '../../db/models'
import { Icon } from '../../designSystem'
import Multiselect from '../../designSystem/Multiselect'

type Props = {
  exercise: Exercise
  setExercise: (updated: Exercise) => void
}
const ExerciseEditForm: React.FC<Props> = ({ exercise, setExercise }) => {
  const { exerciseStore } = useStores()
  const [weightIncrement, setWeightIncrement] = useState(
    `${exercise.weightIncrement}`
  )
  function handleNumericChange(text: string) {
    // Remove non-numeric characters using a regular expression
    const sanitizedValue = text.replace(/[^0-9.]/g, '')
    setWeightIncrement(sanitizedValue)
    setExercise({
      ...exercise,
      weightIncrement: Number(sanitizedValue),
    })
  }

  function onMusclesChange(selected: string[]) {
    if (selected.length > 0) {
      setExercise({
        ...exercise,
        muscles: selected as Exercise['muscles'],
      })
    }
  }

  function onAddMusclePress() {
    // Todo: route to muscle create
  }

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <TextInput
        label="Name"
        value={exercise.name}
        onChangeText={text =>
          setExercise({
            ...exercise,
            name: text,
          })
        }
      />
      <TextInput
        value={weightIncrement}
        keyboardType="decimal-pad"
        onChangeText={handleNumericChange}
        label="Weight Increment"
      />
      <View style={{ flexDirection: 'row' }}>
        <Multiselect
          options={exerciseStore.muscleOptions}
          selectedOptions={exercise.muscles}
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
