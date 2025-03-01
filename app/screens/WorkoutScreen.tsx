import { useNavigation } from '@react-navigation/native'
import type { StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { FlatList, ListRenderItemInfo, View } from 'react-native'

import WorkoutBottomControls from '@/components/Workout/WorkoutBottomControls'
import WorkoutDayView from '@/components/Workout/WorkoutDayView'
import { Workout } from '@/db/models'
import { useStores } from 'app/db/helpers/useStores'
import { formatDateIso, getDateRange } from 'app/utils/date'
import { HorizontalScreenList } from 'designSystem'

export type WorkoutScreenProps = StaticScreenProps<{
  workoutDate?: Workout['date'] // TODO think this through
}>

export const WorkoutScreen: React.FC<WorkoutScreenProps> = observer(props => {
  const { stateStore, workoutStore } = useStores()
  const workoutList = useRef<FlatList<string>>(null)

  const dates = useMemo(() => {
    const from = stateStore.firstRenderedDate
    const to = stateStore.lastRenderedDate

    return getDateRange(from, to)
  }, [stateStore.firstRenderedDate, stateStore.lastRenderedDate])

  const { setOptions } = useNavigation()

  const routeWorkout = useMemo(() => {
    return props.route.params?.workoutDate
      ? workoutStore.dateWorkoutMap[props.route.params.workoutDate]
      : undefined
  }, [props.route.params?.workoutDate, workoutStore.dateWorkoutMap])

  const currentIndex = useRef(
    dates.indexOf(routeWorkout?.date ?? stateStore.openedDate)
  )
  function onScreenChange(index: number) {
    currentIndex.current = index
    stateStore.setOpenedDate(dates[index]!)

    // setParams({ title: formatDateIso(stateStore.openedDate, 'long') })
    setOptions({ title: formatDateIso(stateStore.openedDate, 'long') })
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    return <WorkoutDayView date={dates[index]!} />
  }
  useEffect(() => {
    const index = dates.indexOf(stateStore.openedDate)

    if (index < 0 || index >= dates.length) {
      // should not happen
      return
    }

    if (stateStore.openedDate === dates[currentIndex.current]) return

    workoutList.current?.scrollToIndex({ index, animated: false })
  }, [stateStore.openedDate, dates])

  return (
    <View style={{ flex: 1 }}>
      <HorizontalScreenList
        ref={workoutList}
        data={dates}
        renderItem={renderItem}
        onScreenChange={onScreenChange}
        initialScrollIndex={currentIndex.current}
      />
      <WorkoutBottomControls />
    </View>
  )
})
