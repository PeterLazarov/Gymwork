import { Slot } from 'expo-router'

import 'reflect-metadata'
import { DatabaseConnectionProvider } from '../db/setup'

export default function Layout() {
  return (
    <DatabaseConnectionProvider>
      <Slot />
    </DatabaseConnectionProvider>
  )
}
