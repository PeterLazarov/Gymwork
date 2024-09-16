import React, { ReactNode } from 'react'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { ViewStyle } from 'react-native'

import { EmptyLayout } from './EmptyLayout'

type Props = {
  children?: ReactNode
  style?: ViewStyle
}
export const SafeLayout: React.FC<Props> = ({ children, style }) => {
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <EmptyLayout
          style={{
            paddingBottom: insets && insets.bottom > 0 ? insets.bottom : 0,
            paddingTop: insets && insets.top > 0 ? insets.top : 0,
            ...style,
          }}
        >
          {children}
        </EmptyLayout>
      )}
    </SafeAreaInsetsContext.Consumer>
  )
}
