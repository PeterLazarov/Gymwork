import { View, Text, Button, TextInput } from 'react-native'
import React from 'react'
import IncrementDecrementButtons from './IncrementDecrementButtons'
import { useAtomValue } from 'jotai'
import { weightUnitAtom } from '../atoms'
import { Workout } from '../types/Workout'
import { Table, TR, TH, TD, THead, TBody, Caption } from '@expo/html-elements'
import { ExerciseSet } from '../types/ExerciseSet'
import { Exercise } from '../types/Exercise'
import WorkoutExerciseEntryHeader from './WorkoutExerciseEntryHeader'

function WorkoutExerciseEntrySet(props: {
  set: ExerciseSet
  onChange: (set: ExerciseSet) => void
  onRemove: () => void
}) {
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
          value={props.set.reps}
          onChange={n => props.onChange({ ...props.set, reps: Math.max(n, 0) })}
        >
          <TextInput
            style={{ flexGrow: 1, textAlign: 'center' }}
            inputMode="numeric"
            multiline={false}
            keyboardType="number-pad"
            onChangeText={text => {
              props.onChange({
                ...props.set,
                reps: isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0),
              })
            }}
            maxLength={3}
          >
            {props.set.reps}
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
          props.onChange({
            ...props.set,
            weight: isNaN(+text) ? 0 : Math.max(+text, 0),
          })
        }}
        textAlign="center"
      >
        {props.set.weight ?? 0}
      </TextInput>

      <View style={{ width: '30%' }}>
        <Button
          title="Remove set"
          onPress={props.onRemove}
        />
      </View>
    </TR>
  )
}

const defaultSet: ExerciseSet = { reps: 8, weight: 20, weightUnit: 'kg' }

export default function WorkoutExerciseEntry(props: {
  exercise: Exercise
  sets: Workout['work'][number]['sets']
  onChangeSets(work: Workout['work'][number]['sets']): void
}) {
  return (
    <View
      style={{
        backgroundColor: '#f4f4f4',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        gap: 24,
      }}
    >
      {/* <Caption style={{ marginBottom: 16, fontWeight: 'bold' }}> */}
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {props.exercise.name}
      </Text>
      {/* </Caption> */}

      <WorkoutExerciseEntryHeader />

      {props.sets.map((set, i) => (
        <WorkoutExerciseEntrySet
          key={i}
          set={set}
          onChange={set => {
            props.onChangeSets(
              props.sets.map((_s, _i) => (i === _i ? set : _s))
            )
          }}
          onRemove={() => {
            props.onChangeSets(props.sets.filter((_, _i) => _i !== i))
          }}
        />
      ))}

      <Button
        title="Add set"
        onPress={() => {
          props.onChangeSets(props.sets.concat(props.sets.at(-1) ?? defaultSet))
        }}
      />
    </View>
  )
}
