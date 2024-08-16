import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, Menu } from 'react-native-paper'

import WorkoutExerciseHistoryView from 'app/components/WorkoutExercise/WorkoutExerciseHistoryView/WorkoutExerciseHistoryView'
import WorkoutExerciseRecordsView from 'app/components/WorkoutExercise/WorkoutExerciseRecordsView'
import WorkoutExerciseTrackView from 'app/components/WorkoutExercise/WorkoutExerciseTrackView/WorkoutExerciseTrackView'
import Timer from 'app/components/Timer/Timer'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { Icon, SwipeTabs, colors } from 'designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { timeStore, stateStore } = useStores()

  const [view, setView] = useState('track')
  const [menuOpen, setMenuOpen] = useState(false)
  const [graphHidden, setGraphHidden] = useState(false)

  function onBackPress() {
    navigate('Workout')
    stateStore.setOpenedExercise(null)
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

  function onToggleGraphPress() {
    setMenuOpen(false)
    setGraphHidden(!graphHidden)
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
        backgroundColor: colors.secondary,
      }}
    >
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.BackAction
          onPress={onBackPress}
          color={colors.secondaryText}
        />
        <Appbar.Content
          title={stateStore.openedExercise?.name || ''}
          titleStyle={{ color: colors.secondaryText }}
        />

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
          <Timer />
        )}
      </SwipeTabs>
    </View>
  )
}

export default observer(WorkoutExercisePage)
