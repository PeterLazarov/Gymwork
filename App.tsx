import '@expo/metro-runtime'
import * as SplashScreen from 'expo-splash-screen'
import App from '@/app'
import '@total-typescript/ts-reset/dist/recommended'

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
