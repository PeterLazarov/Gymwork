import React, { useState } from 'react'
import { View } from 'react-native'
import { Menu } from 'react-native-paper'

import WorkoutExerciseHistoryView from 'app/components/WorkoutExercise/WorkoutExerciseHistoryView'
import WorkoutExerciseRecordsView from 'app/components/WorkoutExercise/WorkoutExerciseRecordsView'
import WorkoutExerciseTrackView from 'app/components/WorkoutExercise/WorkoutExerciseTrackView'
import WorkoutExerciseChartView from 'app/components/WorkoutExercise/WorkoutExerciseChartView'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, SwipeTabs, colors } from 'designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { stateStore } = useStores()

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
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.primaryText}
          />
        </IconButton>
        <Header.Title title={stateStore.openedExercise?.name || ''} />

        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchorPosition="bottom"
          anchor={
            <IconButton
              onPress={() => setMenuOpen(true)}
              underlay="darker"
            >
              <Icon
                icon="ellipsis-vertical"
                color={colors.primaryText}
              />
            </IconButton>
          }
        >
          <Menu.Item
            onPress={onEditExercisePress}
            title={translate('editExercise')}
          />
        </Menu>
      </Header>

      {stateStore.openedExerciseGuid && <SwipeTabs tabsConfig={tabs} />}
    </View>
  )
}

export default WorkoutExercisePage
