import { TR } from '@expo/html-elements'
import { useAtomValue } from 'jotai'
import React from 'react'
import { View, Button, TextInput } from 'react-native'

import IncrementDecrementButtons from './IncrementDecrementButtons'
import { weightUnitAtom } from '../atoms'
import { WorkoutExerciseSet } from '../db/models'

type Props = {
  set: WorkoutExerciseSet
  onChange: (set: WorkoutExerciseSet) => void
  onRemove: () => void
}

export const WorkoutExerciseEntrySet: React.FC<Props> = ({
  set,
  onChange,
  onRemove,
}) => {
  const weightUnit = useAtomValue(weightUnitAtom)

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
          value={set.reps!}
          onChange={n => onChange({ ...set, reps: Math.max(n, 0) })}
        >
          <TextInput
            style={{ flexGrow: 1, textAlign: 'center' }}
            inputMode="numeric"
            multiline={false}
            keyboardType="number-pad"
            onChangeText={text => {
              onChange({
                ...set,
                reps: isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0),
              })
            }}
            maxLength={3}
          >
            {set.reps}
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
          onChange({
            ...set,
            weight: isNaN(+text) ? 0 : Math.max(+text, 0),
          })
        }}
        textAlign="center"
      >
        {set.weight ?? 0}
      </TextInput>

      <View style={{ width: '30%' }}>
        <Button
          title="Remove set"
          onPress={onRemove}
        />
      </View>
    </TR>
  )
}
