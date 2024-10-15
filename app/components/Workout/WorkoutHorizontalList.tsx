import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  useWindowDimensions,
  View,
} from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { getDateRange } from 'app/utils/date'
import { HorizontalScreenList } from 'designSystem'
import WorkoutDayView from './WorkoutDayView'
import WorkoutBottomControls from './WorkoutBottomControls'
import { NavigationContainer } from '@react-navigation/native'
import { getActiveRouteName } from 'app/navigators'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { DateTime } from 'luxon'

// const today = DateTime.now()
const visibleTabs = 15

const WorkoutHorizontalList = () => {
  const { stateStore } = useStores()

  const [currentDate, setCurrentDate] = useState(DateTime.now().toISODate())

  const allDates = useMemo(() => {
    const from = stateStore.firstRenderedDate
    const to = stateStore.lastRenderedDate

    return getDateRange(from, to)
  }, [])

  const visibleDates = useMemo(() => {
    const currentIndex = allDates.indexOf(currentDate)
    const datePadding = (visibleTabs - 1) / 2

    return allDates.slice(
      currentIndex - datePadding,
      currentIndex + datePadding
    )
  }, [currentDate])

  const Tab = createMaterialTopTabNavigator()
  const dimensions = useWindowDimensions()
  const tabWidth = dimensions.width / 3

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        independent
        // theme={navTheme}
        onStateChange={state => {
          if (state) {
            const date = getActiveRouteName(state)
            console.log({ date })
            setCurrentDate(date)
          }
        }}
      >
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: {
              minWidth: tabWidth,
              width: 'auto',
            },
          }}
          backBehavior="none"
          initialRouteName={currentDate}
        >
          {visibleDates.map(date => (
            <Tab.Screen
              key={date}
              name={date}
            >
              {() => {
                return visibleDates.includes(date) ? (
                  <WorkoutDayView date={date} />
                ) : null
              }}
            </Tab.Screen>
          ))}
        </Tab.Navigator>
      </NavigationContainer>

      <WorkoutBottomControls />
    </View>
  )
}

export default observer(WorkoutHorizontalList)
