import { View, Text, Button, TextInput } from 'react-native'
import React from 'react'
import IncrementDecrementButtons from './IncrementDecrementButtons'
import { useAtomValue } from 'jotai'
import { weightUnitAtom } from '../atoms'
import { Workout } from '../types/Workout'
import { Table, TR, TH, TD, THead, TBody, Caption } from '@expo/html-elements'
import { ExerciseSet } from '../types/ExerciseSet'
import { Exercise } from '../types/Exercise'

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
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TD>
        <IncrementDecrementButtons
          value={props.set.reps}
          onChange={n => props.onChange({ ...props.set, reps: Math.max(n, 0) })}
        >
          <TextInput
            style={{ padding: 8 }}
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
      </TD>

      <TD style={{ display: 'flex', textAlign: 'center' }}>
        <TextInput
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          // style={{ marginLeft: 4 }}
          maxLength={3}
          onChangeText={text => {
            props.onChange({
              ...props.set,
              weight: isNaN(+text) ? 0 : Math.max(+text, 0),
            })
          }}
        >
          {props.set.weight ?? 0}
        </TextInput>
        <Text>{weightUnit}</Text>
      </TD>

      <TD>
        <Button
          title="Remove set"
          onPress={props.onRemove}
        />
      </TD>
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
      <Table>
        <Caption style={{ marginBottom: 16, fontWeight: 'bold' }}>
          {props.exercise.name} {typeof props.exercise}
        </Caption>

        <THead>
          <TR>
            <TH>
              <Text style={{ fontWeight: 'normal' }}>Reps</Text>
            </TH>
            <TH>
              <Text style={{ fontWeight: 'normal' }}>Weight</Text>
            </TH>
            <TH>
              <Text style={{ fontWeight: 'normal' }}></Text>
            </TH>
          </TR>
        </THead>

        <TBody>
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
        </TBody>
      </Table>

      <Button
        title="Add set"
        onPress={() => {
          props.onChangeSets(props.sets.concat(defaultSet))
        }}
      />
    </View>
  )
}
