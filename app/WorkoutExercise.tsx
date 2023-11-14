import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, Menu, SegmentedButtons } from 'react-native-paper'

import WorkoutExerciseHistoryView from '../components/WorkoutExercise/WorkoutExerciseHistoryView'
import WorkoutExerciseRecordsView from '../components/WorkoutExercise/WorkoutExerciseRecordsView'
import WorkoutExerciseTrackView from '../components/WorkoutExercise/WorkoutExerciseTrackView'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { workoutStore, openedExercise } = useStores()
  const router = useRouter()

  const [view, setView] = useState('track')
  const [menuOpen, setMenuOpen] = useState(false)
  const [graphHidden, setGraphHidden] = useState(false)

  function onBackPress() {
    router.push('/')
    workoutStore.setOpenedExercise(null)
  }

  function onToggleGraphPress() {
    setGraphHidden(!graphHidden)
    setMenuOpen(false)
  }

  return (
    <View
      style={{
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
      }}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={openedExercise?.name} />

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
            onPress={() => {}}
            title="Some shit"
          />
          {view === 'history' && (
            <Menu.Item
              onPress={onToggleGraphPress}
              title={graphHidden ? 'Show graph' : 'Hide graph'}
            />
          )}
        </Menu>
      </Appbar.Header>
      <SegmentedButtons
        value={view}
        onValueChange={setView}
        style={{ marginHorizontal: 16 }}
        buttons={[
          {
            value: 'track',
            label: 'Track',
          },
          {
            value: 'history',
            label: 'History',
          },
          { value: 'records', label: 'Records' },
        ]}
      />
      <View
        style={{
          flexGrow: 1,
        }}
      >
        {view === 'track' && <WorkoutExerciseTrackView />}
        {view === 'history' && (
          <WorkoutExerciseHistoryView graphHidden={graphHidden} />
        )}
        {view === 'records' && <WorkoutExerciseRecordsView />}
      </View>
    </View>
  )
}
export default observer(WorkoutExercisePage)
