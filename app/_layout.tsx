import { config } from '@gluestack-ui/config'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native'

import 'reflect-metadata'

import '../utils/ignoreWarnings'
import Nav from '../components/Nav'
import DBStoreInitializer from '../db/DBStoreInitializer'
import { useInitialRootStore } from '../db/helpers/useStores'

export default function Layout() {
  useInitialRootStore(() => {})

  return (
    <DBStoreInitializer>
      <GluestackUIProvider config={config}>
        <SafeAreaView
          style={{
            display: 'flex',
            height: '100%',
          }}
        >
          <Nav />
          <Slot />
        </SafeAreaView>
      </GluestackUIProvider>
    </DBStoreInitializer>
  )
}
