import React from 'react'
import { View, Text } from 'react-native'

import DayControl from '../components/DayControl'
import Nav from '../components/Nav'
import ExercisePicker from '../components/ExercisePicker'

const Workout = () => {
  return (
    <View>
      <Nav />
      <Text style={{textAlign:'center'}}>Workout</Text>
      <DayControl />
      <ExercisePicker />
    </View>
  )
}

export default Workout
