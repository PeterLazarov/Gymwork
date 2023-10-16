import { Link } from 'expo-router'
import React from 'react'
import { SafeAreaView, View } from 'react-native'

export default () => {
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Link href="/">Home</Link>
        <Link href="/Calendar">Calendar</Link>
        <Link href="/Log">Log</Link>
      </View>
    </SafeAreaView>
  )
}
