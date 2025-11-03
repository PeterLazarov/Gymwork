import React, { ReactNode } from "react"
import { Platform, View, ViewStyle } from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"

import { useColors } from "@/designSystem"

const isIos = Platform.OS === "ios"

type Props = {
  children?: ReactNode
  style?: ViewStyle
  hasFooter?: boolean
}
export const BaseLayout: React.FC<Props> = ({ children, style, hasFooter }) => {
  const colors = useColors()

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surfaceContainer,
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
