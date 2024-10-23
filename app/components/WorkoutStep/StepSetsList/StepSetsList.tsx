import React from 'react'
import { observer } from 'mobx-react-lite'
import { computed } from 'mobx'

import SetListItem from './SetListItem'
import { WorkoutModel, WorkoutSet, WorkoutStep } from 'app/db/models'
import { useStores } from 'app/db/helpers/useStores'
import { getParentOfType } from 'mobx-state-tree'

export type StepSetsListProps = {
  step: WorkoutStep
  sets: WorkoutSet[]
  hideSupersetLetters?: boolean
}

const StepSetsList: React.FC<StepSetsListProps> = ({
  step,
  sets,
  hideSupersetLetters = false,
}) => {
  const { stateStore, recordStore, settingsStore } = useStores()

  const stepRecords = computed(() => recordStore.getRecordsForStep(step)).get()
  // TODO deduplicate
  const showSetCompletion =
    settingsStore.showSetCompletion &&
    getParentOfType(step, WorkoutModel).hasIncompleteSets

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          measurements={set.exercise.measurements}
          isRecord={stepRecords.some(({ guid }) => guid === set.guid)}
          isFocused={stateStore.highlightedSetGuid === set.guid}
          letter={
            hideSupersetLetters
              ? undefined
              : step.exerciseLettering[set.exercise.guid]
          }
          number={step.setNumberMap[set.guid]}
          showSetCompletion={showSetCompletion}
        />
      ))}
    </>
  )
}

export default observer(StepSetsList)
