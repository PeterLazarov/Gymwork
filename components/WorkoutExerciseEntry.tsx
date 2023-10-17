import { View, Text, Button, TextInput } from 'react-native'
import { Exercise } from './ExercisePicker'
import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import IncrementDecrementButtons from './IncrementDecrementButtons'
import { useAtomValue } from 'jotai'
import { weightUnitAtom } from '../atoms'
import { Workout } from '../types/Workout'
import {
  H3,
  Table,
  TR,
  TH,
  TD,
  THead,
  TBody,
  Caption,
} from '@expo/html-elements'

type ExerciseSet = {
  weight: number
  reps: number
  completedAt?: DateTime
}

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

const defaultSet: ExerciseSet = { reps: 8, weight: 20 }

export default function WorkoutExerciseEntry(props: {
  exercise: Exercise
  onChangeWork(work: Workout['work'][number]): void
}) {
  const [sets, setSets] = useState<ExerciseSet[]>([defaultSet])
  const weightUnit = useAtomValue(weightUnitAtom)
  useEffect(() => {
    const work: Workout['work'][number] = {
      exercise: props.exercise.name,
      sets: sets.map(({ reps, weight }) => ({ reps, weight, weightUnit })),
    }

    props.onChangeWork(work)
  })

  return (
    <View
      style={{
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#f4f4f4',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        gap: 24,
      }}
    >
      <Table>
        <Caption style={{ marginBottom: 16, fontWeight: 'bold' }}>
          {props.exercise.name}
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
          {sets.map((set, i) => (
            <WorkoutExerciseEntrySet
              key={i}
              set={set}
              onChange={set => {
                setSets(sets.map((_s, _i) => (i === _i ? set : _s)))
              }}
              onRemove={() => {
                setSets(sets.filter(_s => _s !== set))
              }}
            />
          ))}
        </TBody>
      </Table>

      <Button
        title="Add set"
        onPress={() => {
          setSets(sets.concat({ ...(sets.at(-1) ?? defaultSet) }))
        }}
      />
    </View>
  )
}
