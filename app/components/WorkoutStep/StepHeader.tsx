import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { Menu } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Header, Icon, IconButton, colors } from 'designSystem'

const StepHeader: React.FC = () => {
  const { stateStore } = useStores()

  const [menuOpen, setMenuOpen] = useState(false)

  const deleteSelectedExercises = () => {
    stateStore.openedWorkout!.removeStep(stateStore.focusedStep!)
    stateStore.setFocusedStep('')
    navigate('Workout')
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate('ExerciseEdit')
  }

  function goBack() {
    navigate('WorkoutDay')
    stateStore.setProp('focusedStepGuid', '')
  }

  const focusedStepName = useMemo(() => {
    const step = stateStore.focusedStep!
    const workout = stateStore.openedWorkout!

    const name = step.type === 'straightSet' ? step.exercise!.name : 'Superset'
    let similarSteps = workout.steps.filter(s => s.type === step.type)

    if (step.type === 'straightSet') {
      similarSteps = similarSteps.filter(s =>
        s.exercises.includes(stateStore.focusedExercise!)
      )
    }

    const n = similarSteps.indexOf(step) + 1

    return `${name} ${similarSteps.length > 1 ? n : ''}`
  }, [])

  return (
    <Header>
      <IconButton
        onPress={goBack}
        underlay="darker"
      >
        <Icon
          color={colors.primaryText}
          icon="chevron-back"
        />
      </IconButton>
      <Header.Title
        title={focusedStepName}
        numberOfLines={1}
      />

      {stateStore.focusedStepGuid && (
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
          <Menu.Item
            onPress={deleteSelectedExercises}
            title={translate('removeExercise')}
          />
        </Menu>
      )}
    </Header>
  )
}

export default observer(StepHeader)
