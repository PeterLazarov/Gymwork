import { TR } from '@expo/html-elements'
import React, { useEffect, useState } from 'react'
import { View, TextInput } from 'react-native'

import IncrementDecrementButtons from './IncrementDecrementButtons'
import { WorkoutExerciseSet } from '../db/models'
import { Icon, IconButtonContainer } from '../designSystem'

type Props = {
  set: WorkoutExerciseSet
  onRemove: (setToRemove: WorkoutExerciseSet) => void
  onUpdate: (updatedSet: WorkoutExerciseSet) => void
}

const WorkoutExerciseEntrySet: React.FC<Props> = ({
  set,
  onRemove,
  onUpdate,
}) => {
  const [exerciseSet, setExerciseSet] = useState<WorkoutExerciseSet>(set)

  useEffect(() => {
    setExerciseSet(set)
  }, [set])

  function updateSet(changeObj: Partial<WorkoutExerciseSet>) {
    const updatedSet = {
      ...exerciseSet,
      ...changeObj,
    }

    onUpdate(updatedSet)

    setExerciseSet(updatedSet)
  }

  return (
    <TR
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        // alignItems: 'center',
        // justifyContent: 'center',
      }}
    >
      <View
        style={{
          // width: '30%',
          flex: 1,
          // backgroundColor: '#00ff0088',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IncrementDecrementButtons
          value={exerciseSet.reps!}
          onChange={n => updateSet({ reps: Math.max(n, 0) })}
        >
          <TextInput
            style={{ flexGrow: 1, textAlign: 'center' }}
            inputMode="numeric"
            multiline={false}
            keyboardType="number-pad"
            onChangeText={text => {
              updateSet({
                reps: isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0),
              })
            }}
            maxLength={3}
          >
            {exerciseSet.reps}
          </TextInput>
        </IncrementDecrementButtons>
      </View>

      <TextInput
        inputMode="numeric"
        style={{ height: '100%', flexGrow: 1 }}
        // multiline={false}
        keyboardType="number-pad"
        // style={{ marginLeft: 4 }}
        maxLength={3}
        onChangeText={text => {
          updateSet({
            weight: isNaN(+text) ? 0 : Math.max(+text, 0),
          })
        }}
        textAlign="center"
      >
        {exerciseSet.weight ?? 0}
      </TextInput>

      <IconButtonContainer onPress={() => onRemove(exerciseSet)}>
        <Icon
          icon="close"
          color="red"
        />
      </IconButtonContainer>
    </TR>
  )
}

export default WorkoutExerciseEntrySet
