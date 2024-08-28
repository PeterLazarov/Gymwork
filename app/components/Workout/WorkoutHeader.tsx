import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Menu } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { useShare } from 'app/utils/useShare'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, colors } from 'designSystem'
import { getSnapshot } from 'mobx-state-tree'
import useBenchmark from 'app/utils/useBenchmark'

const WorkoutHeader: React.FC = () => {
  const { stateStore, workoutStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)
  const share = useShare()

  const hasNotes = stateStore.openedWorkout?.notes !== ''
  const focusedExerciseCount = stateStore.focusedExerciseGuids.length

  function openCalendar() {
    navigate('Calendar')
  }

  function onCommentPress() {
    navigate('WorkoutFeedback')
  }

  const deleteSelectedExercises = () => {
    stateStore.deleteSelectedExercises()
  }

  const exportData = () => {
    setMenuOpen(false)

    share(getSnapshot(workoutStore)) // TODO fix
  }

  const deleteWorkout = () => {
    setMenuOpen(false)
    workoutStore.removeWorkout(stateStore.openedWorkout!)
  }

  const { performBenchmark } = useBenchmark()

  return (
    <Header>
      <Header.Title
        title={
          focusedExerciseCount > 0
            ? translate('selectedExerciseNumber', {
                number: focusedExerciseCount,
              })
            : 'Gymwork'
        }
      />

      {stateStore.openedWorkout && (
        <IconButton
          onPress={onCommentPress}
          underlay="darker"
        >
          <Icon
            color={colors.primaryText}
            icon={hasNotes ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
          />
        </IconButton>
      )}

      {focusedExerciseCount > 0 && (
        <IconButton
          onPress={deleteSelectedExercises}
          underlay="darker"
        >
          <Icon
            icon="delete"
            color={colors.primaryText}
          />
        </IconButton>
      )}

      <IconButton
        onPress={openCalendar}
        underlay="darker"
      >
        <Icon
          icon="calendar-sharp"
          color={colors.primaryText}
        />
      </IconButton>

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
          onPress={exportData}
          title={translate('exportData')}
        />
        <Menu.Item
          onPress={deleteWorkout}
          title={translate('removeWorkout')}
        />
        <Menu.Item
          onPress={performBenchmark}
          title="Perform benchmark"
        />
      </Menu>
    </Header>
  )
}

export default observer(WorkoutHeader)
