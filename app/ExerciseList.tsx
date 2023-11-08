import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'

import { useStores } from '../db/helpers/useStores'
import { Exercise } from '../db/models'
import { Icon, IconButtonContainer } from '../designSystem'
import texts from '../texts'

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

  function handleSelectExercise(guid: string) {
    const [exercise] = filteredExercises.filter(e => e.guid === guid)
    workoutStore.addWorkoutExercise(exercise)
    router.push('/')
  }

  function onBackPress() {
    router.push('/')
  }

  return (
    <View>
      <ScrollView style={{ display: 'flex', flexDirection: 'column' }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButtonContainer onPress={onBackPress}>
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
          <IconButtonContainer onPress={onBackPress}>
            <Icon icon="ellipsis-vertical" />
          </IconButtonContainer>
        </View>
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
    </View>
  )
}
export default observer(ExerciseListPage)
