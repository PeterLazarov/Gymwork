import { observer } from 'mobx-react-lite'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { SubSectionLabel } from '../designSystem/Label'
import colors from '../designSystem/colors'

const WorkoutTimer: React.FC = () => {
  const { timeStore } = useStores()

  function onPress() {
    if (!timeStore.timerRunning) {
      timeStore.startTimer()
    }
  }

  return (
    <TouchableOpacity
      style={styles.timerPanel}
      onPress={onPress}
    >
      <Text variant="labelSmall">Press to edit</Text>
      <SubSectionLabel>W: {timeStore.stopwatchValue}</SubSectionLabel>
      <SubSectionLabel>E: {timeStore.timerValue}</SubSectionLabel>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  timerPanel: {
    display: 'flex',
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
    width: 140,
    alignSelf: 'center',
  },
})

export default observer(WorkoutTimer)
