import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { useStores } from '../db/helpers/useStores'
import { SubSectionLabel } from '../designSystem/Label'
import colors from '../designSystem/colors'

const WorkoutTimer: React.FC = () => {
  const { timeStore } = useStores()

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 4,
        width: 120,
        alignSelf: 'center',
      }}
    >
      <SubSectionLabel>{timeStore.stopwatchValue}</SubSectionLabel>
    </View>
  )
}

export default observer(WorkoutTimer)
