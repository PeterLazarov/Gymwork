import React, { ReactNode } from 'react'
// import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { View, ViewStyle } from 'react-native'

import { KeyboardCollapseView, useColors } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  children?: ReactNode
  style?: ViewStyle
  hasFooter?: boolean
}
export const EmptyLayout: React.FC<Props> = ({
  children,
  style,
  hasFooter,
}) => {
  const colors = useColors()
  const { stateStore } = useStores()

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
      onLayout={event => {
        const { height } = event.nativeEvent.layout
        // Capture initial height on first layout event
        if (stateStore.screenHeight !== height) {
          stateStore.setProp('screenHeight', height)
        }
      }}
    >
      <KeyboardCollapseView
        screenHeight={stateStore.screenHeight}
        footerHeight={hasFooter ? stateStore.footerHeight : undefined}
      >
        {children}
      </KeyboardCollapseView>
    </View>
    // )}
    // </SafeAreaInsetsContext.Consumer>
  )
}
