import { colors } from 'designSystem'
import React from 'react'

import { View, Text } from 'react-native'

const WorkoutEmptyTemplate: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: colors.gray, fontSize: 30 }}>Workout Log Empty</Text>
  </View>
)

export default WorkoutEmptyTemplate
