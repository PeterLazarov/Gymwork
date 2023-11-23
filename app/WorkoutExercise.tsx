import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, Menu } from 'react-native-paper'

import WorkoutExerciseHistoryView from '../components/WorkoutExercise/WorkoutExerciseHistoryView/WorkoutExerciseHistoryView'
import WorkoutExerciseRecordsView from '../components/WorkoutExercise/WorkoutExerciseRecordsView'
import WorkoutExerciseTrackView from '../components/WorkoutExercise/WorkoutExerciseTrackView/WorkoutExerciseTrackView'
import WorkoutTimer from '../components/WorkoutTimer'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'
import SwipeTabs from '../designSystem/SwipeTabs'
import colors from '../designSystem/colors'

const WorkoutExercisePage: React.FC = () => {
  const { timeStore, stateStore } = useStores()
  const router = useRouter()

  const [view, setView] = useState('track')
  const [menuOpen, setMenuOpen] = useState(false)
  const [graphHidden, setGraphHidden] = useState(false)

  function onBackPress() {
    router.push('/')
    stateStore.setOpenedExercise(null)
  }

  function onEditExercisePress() {
    router.push('/ExerciseEdit')
  }

  function onToggleGraphPress() {
    setGraphHidden(!graphHidden)
    setMenuOpen(false)
  }

  const tabs = [
    {
      label: 'Track',
      name: 'track',
      component: WorkoutExerciseTrackView,
    },
    {
      label: 'History',
      name: 'history',
      component: WorkoutExerciseHistoryView,
      props: { graphHidden }, // (optional) additional props
    },
    {
      label: 'Records',
      name: 'records',
      component: WorkoutExerciseRecordsView,
    },
  ]

  return (
    <View
      style={{
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
      }}
    >
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={stateStore.openedExercise?.name} />

        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchorPosition="bottom"
          anchor={
            <Appbar.Action
              icon={() => <Icon icon="ellipsis-vertical" />}
              onPress={() => setMenuOpen(true)}
              animated={false}
            />
          }
        >
          <Menu.Item
            onPress={onEditExercisePress}
            title="Edit exercise"
          />
          {view === 'history' && (
            <Menu.Item
              onPress={onToggleGraphPress}
              title={graphHidden ? 'Show graph' : 'Hide graph'}
            />
          )}
        </Menu>
      </Appbar.Header>

      <SwipeTabs
        tabsConfig={tabs}
        onTabChange={setView}
      >
        {timeStore.stopwatchValue !== '' && stateStore.isOpenedWorkoutToday && (
          <WorkoutTimer />
        )}
      </SwipeTabs>
    </View>
  )
}

export default observer(WorkoutExercisePage)
