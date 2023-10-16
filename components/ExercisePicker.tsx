import { exercises } from '../data/exercises.json'

import React, { useMemo, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import {
  View,
  TextInput,
  Modal,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { H1, H2 } from '@expo/html-elements'

export type Exercise = (typeof exercises)[number]
const muscleOptions = Array.from(
  new Set(exercises.flatMap(({ primaryMuscles }) => primaryMuscles))
)

const ExercisePicker = (props: {
  onChange: (exercise: Exercise) => unknown
}) => {
  const [selectedExercise, setSelectedExercise] = useState<
    Exercise | undefined
  >(undefined)

  const [filterString, setFilterString] = useState('')
  const [filterMuscle, setFilterMuscle] = useState('')

  const filteredExercises = useMemo(() => {
    let filtered = exercises
    if (filterString) {
      filtered = filtered.filter(({ name }) =>
        name.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    if (filterMuscle) {
      filtered = filtered.filter(({ primaryMuscles }) =>
        primaryMuscles.includes(filterMuscle)
      )
    }
    return filtered
  }, [filterString, filterMuscle])

  function handleSelectExercise(exercise: Exercise) {
    setSelectedExercise(exercise)
    props.onChange(exercise)
  }

  return (
    <Modal visible={true}>
      <SafeAreaView>
        <ScrollView style={{ display: 'flex', flexDirection: 'column' }}>
          <H2>Pick Exercise</H2>

          {/* Filter by name */}
          <TextInput
            style={{ padding: 16 }}
            value={filterString}
            onChangeText={setFilterString}
            placeholder="Search..."
          ></TextInput>

          {/* Filter by muscle */}
          <Picker
            selectedValue={filterMuscle}
            onValueChange={itemValue => {
              setFilterMuscle(itemValue)
            }}
            // mode="dropdown"
          >
            {
              <Picker.Item
                key={'none'}
                label={'Targeted Muscle'}
                value={''}
                enabled={false}
              />
            }
            {muscleOptions.map(muscle => (
              <Picker.Item
                key={muscle}
                label={muscle}
                value={muscle}
              />
            ))}
          </Picker>

          {/* Show exercises */}
          <Picker
            selectedValue={selectedExercise}
            onValueChange={handleSelectExercise}
            // style={{ height: 300, display: 'flex', flexGrow: 1 }}
            itemStyle={{
              flexGrow: 2,
              padding: 16,
            }}
            // mode="dropdown"
          >
            {
              <Picker.Item
                key={'none'}
                label={'Exercise'}
                value={''}
                enabled={false}
              />
            }
            {filteredExercises.map(exercise => (
              <Picker.Item
                key={exercise.name}
                label={exercise.name}
                value={exercise}
              />
            ))}
          </Picker>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default ExercisePicker
