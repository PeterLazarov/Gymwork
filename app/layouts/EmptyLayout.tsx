import React, { ReactNode } from 'react'
// import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { View, ViewStyle } from 'react-native'

import { useColors } from 'designSystem'

type Props = {
  children?: ReactNode
  style?: ViewStyle
}
export const EmptyLayout: React.FC<Props> = ({ children, style }) => {
  const colors = useColors()

  return (
    // <SafeAreaInsetsContext.Consumer>
    // {insets => (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surfaceContainer,
          // paddingBottom: insets && insets.bottom > 0 ? insets.bottom: 0,
        },
        style,
      ]}
    >
      {children}
    </View>
    // )}
    // </SafeAreaInsetsContext.Consumer>
  )
}
