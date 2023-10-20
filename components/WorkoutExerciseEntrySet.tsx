import { TR } from '@expo/html-elements'
import React, { useState } from 'react'
import { View, Button, TextInput } from 'react-native'

import IncrementDecrementButtons from './IncrementDecrementButtons'
import { WorkoutExerciseSet } from '../db/models'
import { useDatabaseConnection } from '../db/setup'

type Props = {
  set: WorkoutExerciseSet
  onRemove: (setToRemove: WorkoutExerciseSet) => void
}

export const WorkoutExerciseEntrySet: React.FC<Props> = ({ set, onRemove }) => {
  const [exerciseSet, setExerciseSet] = useState<WorkoutExerciseSet>(set)
  const { workoutExerciseSetRepository } = useDatabaseConnection()

  function updateSet(changeObj: Partial<WorkoutExerciseSet>) {
    const updatedSet = {
      ...exerciseSet,
      ...changeObj,
    }

    workoutExerciseSetRepository.update(updatedSet.id, updatedSet)
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
          width: '30%',
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

      <View style={{ width: '30%' }}>
        <Button
          title="Remove set"
          onPress={() => onRemove(exerciseSet)}
        />
      </View>
    </TR>
  )
}
