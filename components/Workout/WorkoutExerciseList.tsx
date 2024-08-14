import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView } from 'react-native'

import { Workout } from '../../app/db/models'
import WorkoutExerciseCard from '../WorkoutExercise/WorkoutExerciseCard'

type Props = {
  workout: Workout
}

const WorkoutExerciseList: React.FC<Props> = ({ workout }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      {workout.exercises.map(exercise => (
        <WorkoutExerciseCard
          key={`${workout!.date}_${exercise.guid}`}
          workout={workout!}
          exercise={exercise}
        />
      ))}
    </ScrollView>
  )
}
export default observer(WorkoutExerciseList)
