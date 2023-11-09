import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Appbar, Searchbar } from 'react-native-paper'

import ExerciseAcordionList from '../components/Exercise/ExerciseAcordionList'
import ExerciseList from '../components/Exercise/ExerciseList'
import { useStores } from '../db/helpers/useStores'
import { Exercise } from '../db/models'
import { Icon } from '../designSystem'
import texts from '../texts'
import { groupBy } from '../utils/array'

const ExerciseListPage: React.FC = () => {
  const { exerciseStore, workoutStore } = useStores()
  const router = useRouter()

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(
    exerciseStore.exercises
  )

  const [filterString, setFilterString] = useState('')
  // const [filterMuscle, setFilterMuscle] = useState('')

  useEffect(() => {
    const result = exerciseStore.exercises.filter(
      e => e.name.indexOf(filterString) !== -1
    )
    setFilteredExercises(result)
  }, [filterString])
  const groupedExercises = useMemo(
    () => groupBy<Exercise>(exerciseStore.exercises, 'muscles'),
    [exerciseStore.exercises]
  )

  function handleSelectExercise(exercise: Exercise) {
    workoutStore.addWorkoutExercise(exercise)
    router.push('/')
  }

  function onBackPress() {
    router.push('/')
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={texts.addExercise} />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={onBackPress}
        />
      </Appbar.Header>

      <Searchbar
        placeholder={texts.search}
        onChangeText={setFilterString}
        value={filterString}
        mode="view"
      />
      <ScrollView style={{ display: 'flex', flexDirection: 'column' }}>
        {filterString === '' && (
          <ExerciseAcordionList
            exercises={groupedExercises}
            onSelect={handleSelectExercise}
          />
        )}
        {filterString !== '' && (
          <ExerciseList
            exercises={filteredExercises}
            onSelect={handleSelectExercise}
          />
        )}
      </ScrollView>
    </View>
  )
}
export default observer(ExerciseListPage)
