import { Text, View } from 'react-native'
import { exercises } from '../data/exercises.json'
import ExerciseHistory from '../components/ExerciseHistory'

export default function Log() {
  return (
    <View>
      <Text>Log Page</Text>

      <ExerciseHistory exercise={exercises[43]} />
    </View>
  )
}
