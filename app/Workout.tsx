import React from 'react'
import { View, Text } from 'react-native'

import DayControl from '../components/DayControl'

const Workout = () => {
  return (
    <View>
      <Text style={{textAlign:'center'}}>Workout</Text>
      <DayControl />
    </View>
  )
}

export default Workout
