import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView } from 'react-native'

import { Workout } from 'app/db/models'
import WorkoutExerciseCard from '../WorkoutExercise/WorkoutExerciseCard'

type Props = {
  workout: Workout
}

const WorkoutExerciseList: React.FC<Props> = ({ workout }) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      nestedScrollEnabled
    >
      {workout.steps.map(step => (
        <WorkoutExerciseCard
          key={`${workout!.date}_${step.guid}`}
          step={step}
        />
      ))}
    </ScrollView>
  )
}
export default observer(WorkoutExerciseList)
