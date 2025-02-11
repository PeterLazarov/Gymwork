/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
// if (__DEV__) {
//   // Load Reactotron in development only.
//   // Note that you must be using metro's `inlineRequires` for this to work.
//   // If you turn it off in metro.config.js, you'll have to manually import it.
//   require('./devtools/ReactotronConfig.ts')
// }
// import './utils/gestureHandler'
import React, { useEffect, useState } from 'react'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { MenuView } from '@react-native-menu/menu'
// import './utils/ignoreWarnings'
// import { useFonts } from 'expo-font'
// import { customFontsToLoad } from './igniteTheme'

import '@ungap/with-resolvers'
import { Appearance, Button, View, Text } from 'react-native'

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  hideSplashScreen()
  // const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  return (
    <View style={{ backgroundColor: 'white', padding: 64, height: 200 }}>
      <View>
        <MenuView
          actions={[
            { title: 'qweqwe', titleColor: 'red' },
            { title: 'abc', titleColor: 'white' },
            { title: 'dfg ewq' },
          ]}
        >
          <Button title="open menu" />
        </MenuView>
      </View>
      <View>
        <Text>Set color scheme to:</Text>
        <Button
          title="dark"
          onPress={() => {
            Appearance.setColorScheme('dark')
          }}
        />
        <Button
          title="light"
          onPress={() => {
            Appearance.setColorScheme('light')
          }}
        />
        <Button
          title="null"
          onPress={() => {
            Appearance.setColorScheme(null)
          }}
        />
      </View>
    </View>
  )
}

export default App
