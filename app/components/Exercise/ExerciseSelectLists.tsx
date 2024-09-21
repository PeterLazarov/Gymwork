import React, { useState } from 'react'
import { Dimensions } from 'react-native'

import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import FavoriteExercisesList from 'app/components/Exercise/FavoriteExercisesList'
import AllExercisesList from 'app/components/Exercise/AllExercisesList'
import MostUsedExercisesList from 'app/components/Exercise/MostUsedExercisesList'
import { TopNavigation, TabConfig } from 'designSystem'

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

  const tabsConfig: TabConfig[] = [
    {
      name: translate('favorite'),
      Component: () => <FavoriteExercisesList {...props} />,
    },
    {
      name: translate('mostUsed'),
      Component: () => <MostUsedExercisesList {...props} />,
    },
    {
      name: translate('allExercises'),
      Component: () => <AllExercisesList {...props} />,
    },
  ]

  return (
    <TopNavigation
      initialRouteName="Favorite"
      tabsConfig={tabsConfig}
      tabWidth={Dimensions.get('screen').width / 3}
    />
  )
}
export default ExerciseSelectLists
