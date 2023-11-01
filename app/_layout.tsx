import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native'

import 'reflect-metadata'

import '../utils/ignoreWarnings'
import { DatabaseConnectionProvider } from '../dbold/DBProvider'
import Nav from '../components/Nav'
import DbShit from '../models/DbShit'
import { useInitialRootStore } from '../models/helpers/useStores'

export default function Layout() {
  useInitialRootStore(() => {})

  return (
    <DbShit>
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
    </DbShit>
  )
}
