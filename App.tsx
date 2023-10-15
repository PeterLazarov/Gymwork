import { StatusBar } from 'expo-status-bar'
import { atom, useAtom, useAtomValue } from 'jotai'
import { StyleSheet, Text, View, TextInput } from 'react-native'

const textAtom = atom('hello')
const uppercaseAtom = atom(get => get(textAtom).toUpperCase())

export default function App() {
  const [text, setText] = useAtom(textAtom)
  const upperCaseText = useAtomValue(uppercaseAtom)
  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
      />
      <Text>{text}</Text>
      <Text>{upperCaseText}</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
