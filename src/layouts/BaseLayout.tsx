import React, { ReactNode } from "react"
import { Platform, View, ViewStyle } from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"

import { useColors } from "@/designSystem"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const isIos = Platform.OS === "ios"

type Props = {
  children?: ReactNode
  style?: ViewStyle
  hasFooter?: boolean
  // Set to true when the screen manages the keyboard itself
  // (e.g. via KeyboardAwareScrollView). Prevents double handling
  // where both KeyboardAvoidingView and KeyboardAwareScrollView
  // shift the layout, causing jumps and hidden inputs.
  disableKeyboardAvoiding?: boolean
}
export const BaseLayout: React.FC<Props> = ({
  children,
  style,
  hasFooter,
  disableKeyboardAvoiding,
}) => {
  const colors = useColors()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surfaceContainer,
          paddingBottom: hasFooter ? 0 : insets.bottom,
        },
        style,
      ]}
    >
      {disableKeyboardAvoiding ? (
        <>{children}</>
      ) : (
        <KeyboardAvoidingView
          behavior={isIos ? "padding" : "height"}
          style={[{ flex: 1 }]}
        >
          {children}
        </KeyboardAvoidingView>
      )}
    </View>
  )
}
