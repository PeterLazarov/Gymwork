import React, { ReactNode } from 'react'
// import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { View } from 'react-native'

import { useColors } from 'designSystem'

type Props = {
  children?: ReactNode
}
export const EmptyLayout: React.FC<Props> = ({ children }) => {
  const colors = useColors()

  return (
    // <SafeAreaInsetsContext.Consumer>
    // {insets => (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.neutralLighter,
        // paddingBottom: insets && insets.bottom > 0 ? insets.bottom: 0,
      }}
    >
      {children}
    </View>
    // )}
    // </SafeAreaInsetsContext.Consumer>
  )
}
