import React, { ReactNode } from 'react'
// import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { View } from 'react-native'

import { colors } from 'designSystem'

type Props = {
  children?: ReactNode
}
export const EmptyLayout: React.FC<Props> = ({ children }) => {
  return (
    // <SafeAreaInsetsContext.Consumer>
    // {insets => (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.neutralLight,
        // paddingBottom: insets && insets.bottom > 0 ? insets.bottom: 0,
      }}
    >
      {children}
    </View>
    // )}
    // </SafeAreaInsetsContext.Consumer>
  )
}
