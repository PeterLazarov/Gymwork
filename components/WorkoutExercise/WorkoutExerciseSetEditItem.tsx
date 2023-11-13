import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'

import WorkoutExerciseSetWarmupButton from './WorkoutExerciseSetWarmupButton'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet } from '../../db/models'
import { ButtonContainer, Icon } from '../../designSystem'
import colors from '../../designSystem/colors'
import texts from '../../texts'

type Props = {
  set: WorkoutSet
  isFocused?: boolean
  number?: number
  onPress: () => void
}

const WorkoutExerciseSetEditItem: React.FC<Props> = ({
  set,
  isFocused,
  number,
  onPress,
}) => {
  const { workoutStore } = useStores()
  const isRecord = Object.values(workoutStore.openedExerciseRecords).some(
    record => record.guid === set.guid
  )
  const color = isFocused ? colors.primary : colors.secondaryText

  function toggleSetWarmup() {
    workoutStore.setWorkoutSetWarmup(set, !set.isWarmup)
  }

  return (
    <ButtonContainer
      variant="tertiary"
      onPress={onPress}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 24,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
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
              <WorkoutExerciseSetWarmupButton
                set={set}
                number={number}
                color={color}
              />
            )}
          />
          {isRecord && (
            <Icon
              icon="trophy"
              color={colors.primary}
            />
          )}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          <Text
            style={{
              fontWeight: 'bold',
              color,
            }}
          >
            {set.reps}
          </Text>
          <Text
            style={{
              color,
            }}
          >
            {texts.reps}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          <Text
            style={{
              fontWeight: 'bold',
              color,
            }}
          >
            {set.weight}
          </Text>
          <Text
            style={{
              color,
            }}
          >
            kg
          </Text>
        </View>
      </View>
    </ButtonContainer>
  )
}

export default observer(WorkoutExerciseSetEditItem)
