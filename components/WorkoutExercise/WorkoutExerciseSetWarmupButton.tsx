import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text } from 'react-native'

import { WorkoutSet } from '../../db/models'
import { Icon } from '../../designSystem'

type Props = {
  set: WorkoutSet
  number?: number
  color: string
}
const WorkoutExerciseSetWarmupButton: React.FC<Props> = ({
  set,
  number,
  color,
}) => (
  <>
    {!set.isWarmup && (
      <Text
        style={{
          color,
          fontWeight: 'bold',
          fontSize: 15,
        }}
      >
        {number}.
      </Text>
    )}
    {set.isWarmup && (
      <Icon
        icon="yoga"
        color={color}
      />
    )}
  </>
)
export default observer(WorkoutExerciseSetWarmupButton)
