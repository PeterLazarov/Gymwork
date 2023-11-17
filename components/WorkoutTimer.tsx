import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import { useStores } from '../db/helpers/useStores'
import { SubSectionLabel } from '../designSystem/Label'
import colors from '../designSystem/colors'

const WorkoutTimer: React.FC = () => {
  const { timeStore } = useStores()

  return (
    <View style={styles.timerPanel}>
      <SubSectionLabel>{timeStore.stopwatchValue}</SubSectionLabel>
    </View>
  )
}

const styles = StyleSheet.create({
  timerPanel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
    width: 120,
    alignSelf: 'center',
  },
})

export default observer(WorkoutTimer)
