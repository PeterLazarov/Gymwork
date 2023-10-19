import React from 'react'
import { View, Text, Button } from 'react-native'

import WorkoutExerciseEntryHeader from './WorkoutExerciseEntryHeader'
import { WorkoutExerciseEntrySet } from './WorkoutExerciseEntrySet'
import { WorkoutExercise } from '../db/models'
import { ExerciseSet } from '../types/ExerciseSet'

const defaultSet: ExerciseSet = { reps: 8, weight: 20, weightUnit: 'kg' }

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
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
        {exercise.name}
      </Text>
      {/* </Caption> */}

      <WorkoutExerciseEntryHeader />

      {exercise.sets.map((set, i) => (
        <WorkoutExerciseEntrySet
          key={i}
          set={set}
          onChange={set => {
            // props.onChangeSets(
            //   props.sets.map((_s, _i) => (i === _i ? set : _s))
            // )
          }}
          onRemove={() => {
            // props.onChangeSets(props.sets.filter((_, _i) => _i !== i))
          }}
        />
      ))}

      <Button
        title="Add set"
        onPress={() => {
          // props.onChangeSets(props.sets.concat(props.sets.at(-1) ?? defaultSet))
        }}
      />
    </View>
  )
}

export default WorkoutExerciseEntry
