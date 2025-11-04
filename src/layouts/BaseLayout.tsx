import React, { ReactNode } from "react"
import { Platform, View, ViewStyle } from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"

import { useColors } from "@/designSystem"
import { useSafeAreaInsetsStyle } from "@/utils/ignite/useSafeAreaInsetsStyle"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const isIos = Platform.OS === "ios"

type Props = {
  children?: ReactNode
  style?: ViewStyle
  hasFooter?: boolean
}
export const BaseLayout: React.FC<Props> = ({ children, style, hasFooter }) => {
  const colors = useColors()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surfaceContainer,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
    >
      <KeyboardAvoidingView
        behavior={isIos ? "padding" : "height"}
        style={[{ flex: 1 }]}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  )
}
