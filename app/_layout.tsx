import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native'
import { PaperProvider } from 'react-native-paper'

import 'reflect-metadata'

import '../utils/ignoreWarnings'
import DBStoreInitializer from '../db/DBStoreInitializer'
import { useInitialRootStore } from '../db/helpers/useStores'

export default function Layout() {
  useInitialRootStore(() => {})

  return (
    <DBStoreInitializer>
      <PaperProvider>
        <SafeAreaView
          style={{
            display: 'flex',
            height: '100%',
          }}
        >
          <Slot />
        </SafeAreaView>
      </PaperProvider>
    </DBStoreInitializer>
  )
}
