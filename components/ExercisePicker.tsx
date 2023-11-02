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

import { Icon, IconButtonContainer } from '../designSystem'
import { Exercise } from '../models/Exercise'
import { useStores } from '../models/helpers/useStores'
import texts from '../texts'

type Props = {
  onChange: (exercise: Exercise) => void
  onBack: () => void
}

const ExercisePicker: React.FC<Props> = ({ onChange, onBack }) => {
  const { exerciseStore } = useStores()
  const [selectedGuid, setSelectedGuid] = useState<string | undefined>(
    undefined
  )

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(
    exerciseStore.exercises
  )

  const [filterString, setFilterString] = useState('')
  // const [filterMuscle, setFilterMuscle] = useState('')

  // useEffect(() => {
  //   exerciseRepository
  //     .find({
  //       where: {
  //         name: Like(`%${filterString}%`),
  //       },
  //     })
  //     .then(setFilteredExercises)
  // }, [filterString])

  function handleSelectExercise(guid: string) {
    const [exercise] = filteredExercises.filter(e => e.guid === guid)
    setSelectedGuid(guid)
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
            selectedValue={selectedGuid}
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

            {/* TODO: research immutable state error when using `value={exercise}` */}
            {filteredExercises.map(exercise => (
              <Picker.Item
                key={exercise.name}
                label={exercise.name}
                value={exercise.guid}
              />
            ))}
          </Picker>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default ExercisePicker
