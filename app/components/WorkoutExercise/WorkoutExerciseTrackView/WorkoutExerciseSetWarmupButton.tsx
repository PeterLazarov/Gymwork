import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text } from 'react-native'
import { IconButton } from 'react-native-paper'

import { Icon, colors, fontSize } from 'designSystem'

type Props = {
  isWarmup: boolean
  number?: number
  color: string
  toggleSetWarmup: () => void
}
const WorkoutExerciseSetWarmupButton: React.FC<Props> = ({
  isWarmup,
  number,
  color,
  toggleSetWarmup,
}) => (
  <IconButton
    mode="outlined"
    style={{
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    }}
    containerColor={colors.secondary}
    onPress={toggleSetWarmup}
    icon={() => (
      <>
        {!isWarmup && (
          <Text
            style={{
              fontSize: fontSize.sm,
              color,
              fontWeight: 'bold',
            }}
          >
            {number}
          </Text>
        )}
        {isWarmup && (
          <Icon
            icon="yoga"
            color={color}
          />
        )}
      </>
    )}
  />
)
export default observer(WorkoutExerciseSetWarmupButton)
