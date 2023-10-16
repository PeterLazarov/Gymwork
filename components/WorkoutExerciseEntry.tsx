import { View, Text, Button, TextInput } from 'react-native'
import { Exercise } from './ExercisePicker'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import IncrementDecrementButtons from './IncrementDecrementButtons'
import { useAtomValue } from 'jotai'
import { weightUnitAtom } from '../atoms'
import { Workout } from '../types/Workout'

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
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
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

      <TextInput
        inputMode="numeric"
        multiline={false}
        keyboardType="number-pad"
        style={{ marginLeft: 4 }}
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

      <Button
        title="Remove set"
        onPress={props.onRemove}
      />
    </View>
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        gap: 24,
      }}
    >
      <Text style={{ fontSize: 16, padding: 8 }}>{props.exercise.name}</Text>

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

      <Button
        title="Add set"
        onPress={() => {
          setSets(sets.concat({ ...(sets.at(-1) ?? defaultSet) }))
        }}
      />
    </View>
  )
}
