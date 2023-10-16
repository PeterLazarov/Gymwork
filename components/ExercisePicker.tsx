import { exercises } from '../data/exercises.json'

import React, { useState } from 'react'
import {
  SafeAreaView,
  Pressable,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  
} from 'react-native'
import {Picker} from '@react-native-picker/picker';

type Exercise = typeof exercises[number]


// const Item = ({ name }: { name: string }) => (
  // <Pressable style={styles.item}>
  //   <Text style={styles.name}>{name}</Text>
  // </Pressable>
// )

const ExercisePicker = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | undefined>(undefined);

  return (
    // <SafeAreaView style={styles.container}>
      // <FlatList
      //   data={exercises}
      //   renderItem={({ item }) => <Item name={item.name} />}
      //   keyExtractor={item => item.name}
      // />
    // </SafeAreaView>
    <Picker
    selectedValue={selectedExercise}
  onValueChange={(itemValue, itemIndex) =>
    setSelectedExercise(itemValue)
  }>
    
      {exercises.map(exercise => (<Picker.Item key={exercise.name} label={exercise.name} value={exercise}/>))}
    </Picker>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#eee',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    // fontSize: 16,
  },
})

export default ExercisePicker
