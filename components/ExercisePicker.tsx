import { Picker } from '@react-native-picker/picker'
import React, { useEffect, useState } from 'react'
import {
  TextInput,
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from 'react-native'
import { Like } from 'typeorm'

import { Exercise } from '../db/models'
import { useDatabaseConnection } from '../db/setup'
import { Icon, IconButtonContainer } from '../designSystem'
import texts from '../texts'

type Props = {
  onChange: (exercise: Exercise) => unknown
  onBack: () => void
}

const ExercisePicker: React.FC<Props> = ({ onChange, onBack }) => {
  const [selectedExercise, setSelectedExercise] = useState<
    Exercise | undefined
  >(undefined)

  const { exerciseRepository } = useDatabaseConnection()

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [filterString, setFilterString] = useState('')
  // const [filterMuscle, setFilterMuscle] = useState('')

  useEffect(() => {
    exerciseRepository
      .find({
        where: {
          name: Like(`%${filterString}%`),
        },
      })
      .then(setFilteredExercises)
  }, [filterString])
  // console.log({ filkteredExercises })
  // const filteredExercises = useMemo(() => {
  //   let filtered = exercises
  //   if (filterString) {
  //     filtered = filtered.filter(({ name }) =>
  //       name.toLowerCase().includes(filterString.toLowerCase())
  //     )
  //   }
  //   if (filterMuscle) {
  //     filtered = filtered.filter(({ primaryMuscles }) =>
  //       primaryMuscles.includes(filterMuscle)
  //     )
  //   }
  //   return filtered
  // }, [filterString, filterMuscle])

  function handleSelectExercise(exercise: Exercise) {
    setSelectedExercise(exercise)
    onChange(exercise)
  }

  return (
    <Modal visible>
      <SafeAreaView>
        <ScrollView style={{ display: 'flex', flexDirection: 'column' }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              // justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButtonContainer onPress={onBack}>
              <Icon icon="chevron-back" />
            </IconButtonContainer>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 26,
                flex: 1,
              }}
            >
              {texts.addExercise}
            </Text>
            <IconButtonContainer onPress={onBack}>
              <Icon icon="ellipsis-vertical" />
            </IconButtonContainer>
          </View>
          {/* Filter by name */}
          <TextInput
            style={{ padding: 16 }}
            value={filterString}
            onChangeText={setFilterString}
            placeholder={texts.search}
          />

          {/* Filter by muscle */}
          {/* <Picker
            selectedValue={filterMuscle}
            onValueChange={itemValue => {
              setFilterMuscle(itemValue)
            }}
            // mode="dropdown"
          >
            <Picker.Item
              key="none"
              label="Targeted Muscle"
              value=""
              enabled={false}
            />
            {muscleOptions.map(muscle => (
              <Picker.Item
                key={muscle}
                label={muscle}
                value={muscle}
              />
            ))}
          </Picker> */}

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
            <Picker.Item
              key="none"
              label="Exercise"
              value=""
              enabled={false}
            />
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
