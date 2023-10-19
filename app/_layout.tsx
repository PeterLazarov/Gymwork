import { Slot } from 'expo-router'
import { LogBox } from 'react-native'

import 'reflect-metadata'

import { DatabaseConnectionProvider } from '../db/setup'

export default function Layout() {
  LogBox.ignoreLogs(['Require cycle:'])

  return (
    <DatabaseConnectionProvider>
      <Slot />
    </DatabaseConnectionProvider>
  )
}
