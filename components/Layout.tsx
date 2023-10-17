import { SafeAreaView, ScrollView, View } from 'react-native'
import Nav from './Nav'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <SafeAreaView
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <Nav />

      {props.children}
    </SafeAreaView>
  )
}
