import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import SetDataLabel from '../SetDataLabel'
import { Exercise, WorkoutSet } from 'app/db/models'

type Props = {
  set: WorkoutSet
  exercise: Exercise
}

const RecordsListItem: React.FC<Props> = ({ set, exercise }) => {
  console.log({ exercise, set })
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 32,
        flex: 1,
        opacity: set.isWeakAssRecord ? 0.5 : 1,
      }}
    >
      <SetDataLabel
        value={set[exercise.groupRecordsBy]}
        unit={exercise.measurements[exercise.groupRecordsBy].unit ?? 'reps'}
        fontSize="md"
      />

      <SetDataLabel
        value={set[exercise.measuredBy]}
        unit={exercise.measurements[exercise.measuredBy].unit ?? 'reps'}
        fontSize="md"
      />
    </View>
  )
}

export default observer(RecordsListItem)
