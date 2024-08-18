import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, Menu } from 'react-native-paper'

import WorkoutExerciseHistoryView from 'app/components/WorkoutExercise/WorkoutExerciseHistoryView'
import WorkoutExerciseRecordsView from 'app/components/WorkoutExercise/WorkoutExerciseRecordsView'
import WorkoutExerciseTrackView from 'app/components/WorkoutExercise/WorkoutExerciseTrackView'
import WorkoutExerciseChartView from 'app/components/WorkoutExercise/WorkoutExerciseChartView'
import Timer from 'app/components/Timer/Timer'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Icon, SwipeTabs, colors } from 'designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { timeStore, stateStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)

  function onBackPress() {
    navigate('Workout')
    stateStore.setOpenedExercise(null)
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

  const tabs = [
    {
      label: translate('track'),
      name: 'track',
      component: WorkoutExerciseTrackView,
    },
    {
      label: translate('history'),
      name: 'history',
      component: WorkoutExerciseHistoryView,
    },
    {
      label: translate('records'),
      name: 'records',
      component: WorkoutExerciseRecordsView,
    },
    {
      label: translate('chart'),
      name: 'chart',
      component: WorkoutExerciseChartView,
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
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        <Appbar.BackAction
          onPress={onBackPress}
          color={colors.primaryText}
        />
        <Appbar.Content
          title={stateStore.openedExercise?.name || ''}
          titleStyle={{ color: colors.primaryText }}
        />

        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchorPosition="bottom"
          anchor={
            <Appbar.Action
              icon={() => (
                <Icon
                  icon="ellipsis-vertical"
                  color={colors.primaryText}
                />
              )}
              onPress={() => setMenuOpen(true)}
              animated={false}
            />
          }
        >
          <Menu.Item
            onPress={onEditExercisePress}
            title={translate('editExercise')}
          />
        </Menu>
      </Appbar.Header>

      <SwipeTabs tabsConfig={tabs}>
        {timeStore.stopwatchValue !== '' && stateStore.isOpenedWorkoutToday && (
          <Timer />
        )}
      </SwipeTabs>
    </View>
  )
}

export default observer(WorkoutExercisePage)
