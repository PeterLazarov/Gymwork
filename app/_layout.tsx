import { Slot } from 'expo-router'
import { SafeAreaView, LogBox } from 'react-native'

import 'reflect-metadata'

import { DatabaseConnectionProvider } from '../db/DBProvider'
import Nav from '../components/Nav'

export default function Layout() {
  LogBox.ignoreLogs(['Require cycle:'])

  return (
    <DatabaseConnectionProvider>
      <SafeAreaView
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <Nav />
        <Slot />
      </SafeAreaView>
    </DatabaseConnectionProvider>
  )
}
