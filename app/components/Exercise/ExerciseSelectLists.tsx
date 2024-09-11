import React, { useState } from 'react'
import { View } from 'react-native'

import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import FavoriteExercisesList from 'app/components/Exercise/FavoriteExercisesList'
import AllExercisesList from 'app/components/Exercise/AllExercisesList'
import MostUsedExercisesList from 'app/components/Exercise/MostUsedExercisesList'
import { SwipeTabs } from 'designSystem'
import { TabConfig } from 'designSystem/Tabs/types'

type ExerciseSelectListsProps = {
  multiselect: boolean
  selected: Exercise[]
  onChange(exercises: Exercise[]): void
}

const ExerciseSelectLists: React.FC<ExerciseSelectListsProps> = ({
  multiselect,
  onChange,
  selected,
}) => {
  const [selectedExercises, setSelectedExercises] =
    useState<Exercise[]>(selected)

  function toggleSelectedExercise(exercise: Exercise) {
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises(oldVal => {
        const newSelected = [...oldVal, exercise]
        onChange(newSelected) // TODO refactor

        return newSelected
      })
    } else {
      setSelectedExercises(oldVal => {
        const newSelected = oldVal.filter(e => e.guid !== exercise.guid)
        onChange(newSelected) // TODO refactor

        return newSelected
      })
    }
  }

  const props = {
    onSelect: (exercise: Exercise) => {
      multiselect
        ? toggleSelectedExercise(exercise)
        : setSelectedExercises([exercise])

      // TODO refactor
      !multiselect && onChange([exercise])
    },
    selectedExercises,
  }

  const tabsConfig: TabConfig<typeof props>[] = [
    {
      label: translate('favorite'),
      name: 'tabFavorite',
      component: FavoriteExercisesList,
      props,
    },
    {
      label: translate('mostUsed'),
      name: 'tabMostUsed',
      component: MostUsedExercisesList,
      props,
    },
    {
      label: translate('allExercises'),
      name: 'tabAll',
      component: AllExercisesList,
      props,
    },
  ]

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <SwipeTabs tabsConfig={tabsConfig} />
    </View>
  )
}
export default ExerciseSelectLists
