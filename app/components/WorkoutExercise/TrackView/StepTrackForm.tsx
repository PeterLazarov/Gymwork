import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { View } from 'react-native'

import SetEditList from './SetEditList'
import SetEditControls from './SetEditControls'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet, WorkoutSetModel } from 'app/db/models'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { SetEditActions } from './SetEditActions'
import useTimer from 'app/db/stores/useTimer'

const StepTrackForm: React.FC = () => {
  const { stateStore } = useStores()
  const restTimer = useTimer()
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  const { exercise } = stateStore.focusedStep!
  useEffect(() => {
    const setToClone = selectedSet || stateStore.focusedStepLastSet

    if (setToClone) {
      const { guid, exercise, ...rest } = setToClone
      stateStore.setProp('draftSet', { exercise: exercise.guid, ...rest })
    } else {
      stateStore.setProp('draftSet', {
        exercise: exercise.guid,
        reps: exercise.hasRepMeasument ? 10 : undefined,
      })
    }
  }, [selectedSet, exercise])

  function handleAdd() {
    if (stateStore.draftSet) {
      const { guid, ...draftCopy } = stateStore.draftSet
      const fromDraft = WorkoutSetModel.create({
        ...draftCopy,
        exercise: exercise.guid,
        date: stateStore.openedDate,
      })
      stateStore.focusedStep!.addSet(fromDraft)
    }

    if (exercise.measurements.rest) {
      restTimer.start()
    }
  }

  useEffect(() => {
    if (exercise.measurements.rest) {
      stateStore.draftSet!.setProp(
        'restMs',
        restTimer.timeElapsed.as('milliseconds')
      )
    }
  }, [restTimer.timeElapsed, exercise])

  function handleUpdate() {
    const updatedSet = {
      ...getSnapshot(stateStore.draftSet!),
      exercise: selectedSet!.exercise.guid,
      guid: selectedSet!.guid,
      date: selectedSet!.date,
    }

    stateStore.focusedStep!.updateSet(updatedSet)

    setSelectedSet(null)
  }
  function handleRemove() {
    setSelectedSet(null)
    stateStore.focusedStep!.removeSet(selectedSet!.guid)
  }

  return (
    <KeyboardAvoiderView
      avoidMode="focused-input"
      style={{
        flexDirection: 'column',
        flexGrow: 1,
        gap: 8,
        display: 'flex',
      }}
    >
      <View style={{ padding: 8, flex: 1 }}>
        <SetEditList
          selectedSet={selectedSet}
          setSelectedSet={setSelectedSet}
        />
      </View>

      {stateStore.draftSet && (
        <View style={{ paddingHorizontal: 8 }}>
          <SetEditControls
            value={stateStore.draftSet}
            onSubmit={handleAdd}
          />
        </View>
      )}

      <SetEditActions
        mode={selectedSet ? 'edit' : 'add'}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </KeyboardAvoiderView>
  )
}

export default observer(StepTrackForm)
