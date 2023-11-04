import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native'

import 'reflect-metadata'

import '../utils/ignoreWarnings'
import Nav from '../components/Nav'
import DBStoreInitializer from '../db/DBStoreInitializer'
import { useInitialRootStore } from '../db/helpers/useStores'
import { DatabaseConnectionProvider } from '../dbold/DBProvider'

export default function Layout() {
  useInitialRootStore(() => {})

  return (
    <DBStoreInitializer>
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
    </DBStoreInitializer>
  )
}
