import { View, Text, Button, TextInput } from 'react-native'
import { Exercise } from './ExercisePicker'
import { useState } from 'react'
import { DateTime } from 'luxon'

type ExerciseSet = {
  weight: number
  reps: number
  completedAt?: DateTime
}

function WorkoutExerciseEntrySet(props: {
  set: ExerciseSet
  onChange: (set: ExerciseSet) => void
}) {
  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Button
          onPress={() =>
            props.onChange({ ...props.set, reps: props.set.reps - 1 })
          }
          title=" - "
        ></Button>
        <TextInput
          inputMode="numeric"
          onChangeText={text => {
            props.onChange({ ...props.set, reps: isNaN(+text) ? 0 : +text })
          }}
        >
          {props.set.reps}
        </TextInput>
        <Button
          onPress={() =>
            props.onChange({ ...props.set, reps: props.set.reps + 1 })
          }
          title=" + "
        ></Button>
      </View>

      <TextInput
        inputMode="numeric"
        onChangeText={text => {
          props.onChange({ ...props.set, weight: isNaN(+text) ? 0 : +text })
        }}
      >
        {props.set.weight ?? 0}
      </TextInput>
      <Text>kg</Text>
    </View>
  )
}

const defaultSet = { reps: 0, weight: 20 }

export default function WorkoutExerciseEntry(props: { exercise: Exercise }) {
  const [sets, setSets] = useState<ExerciseSet[]>([defaultSet])

  return (
    <View>
      <Text>{props.exercise.name}</Text>

      {sets.map((set, i) => (
        <WorkoutExerciseEntrySet
          key={i}
          set={set}
          onChange={set => {
            setSets(sets.map((_s, _i) => (i === _i ? set : _s)))
          }}
        />
      ))}

      <Button
        title="Add set"
        onPress={() => {
          setSets(sets.concat({ ...(sets.at(-1) ?? defaultSet) }))
        }}
      ></Button>
    </View>
  )
}
