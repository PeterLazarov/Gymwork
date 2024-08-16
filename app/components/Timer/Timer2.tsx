import { Duration } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import useTimer from 'app/db/stores/useTimer'
import { colors } from 'designSystem'

export default observer(function Timer2() {
  const { start, stop, timeLeft, clear } = useTimer()

  const idk = useMemo(() => {
    return timeLeft.toFormat('mm:ss')
  }, [timeLeft])
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          title="Start"
          onPress={() => start(Duration.fromDurationLike({ minutes: 3 }))}
        />

        <View style={styles.timerPanel}>
          <Text>{idk}</Text>
        </View>

        <Button
          title="Stop"
          onPress={() => stop()}
        />
        <Button
          title="Clear"
          onPress={() => clear()}
        />
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  timerPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightgray,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
    width: 140,
    alignSelf: 'center',
  },
})
