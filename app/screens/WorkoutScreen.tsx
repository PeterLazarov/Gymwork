import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { View } from 'react-native'

import WorkoutBottomControls from '@/components/Workout/WorkoutBottomControls'
import WorkoutDayView from '@/components/Workout/WorkoutDayView'
import { Workout } from '@/db/models'
import { useStores } from 'app/db/helpers/useStores'
import { formatDateIso } from '@/utils/date'
import { useEffect } from 'react'

export type WorkoutScreenProps = StaticScreenProps<{
  workoutDate?: Workout['date'] // TODO think this through
}>

export const WorkoutScreen: React.FC<WorkoutScreenProps> = observer(props => {
  const { stateStore } = useStores()

  const { setOptions } = useNavigation()
  useEffect(() => {
    const title = formatDateIso(stateStore.openedDate, 'long')
    setOptions({title})
  }, [stateStore.openedDate])

  return (
    <View style={{ flex: 1 }}>
      <WorkoutDayView date={stateStore.openedDate} />
      <WorkoutBottomControls />
    </View>
  )
})
