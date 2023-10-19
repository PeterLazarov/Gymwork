import { Slot } from 'expo-router'

import 'reflect-metadata'
import { DatabaseConnectionProvider } from '../db/connection'

export default function Layout() {
  return (
    <DatabaseConnectionProvider>
      <Slot />
    </DatabaseConnectionProvider>
  )
}
