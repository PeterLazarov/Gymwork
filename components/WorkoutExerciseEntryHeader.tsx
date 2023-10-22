import { View, Text } from 'react-native'
import { weightUnitAtom } from '../atoms'
import { useAtomValue } from 'jotai'

export default function WorkoutExerciseEntryHeader() {
  const unit = useAtomValue(weightUnitAtom)

  return (
    <View style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
      <Text style={{ width: '40%', textAlign: 'center' }}>Reps</Text>
      <Text style={{ width: '40%', textAlign: 'center' }}>Weight ({unit})</Text>
    </View>
  )
}
