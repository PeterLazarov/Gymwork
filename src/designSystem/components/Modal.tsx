import React from "react"
import { Modal as RNModal, ModalProps as RNModalProps, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Backdrop } from "./Backdrop"

type ModalProps = Omit<RNModalProps, "visible"> & {
  containerStyle?: ViewStyle
  open: boolean
  onClose: () => void
}

export function Modal({ containerStyle, open, children, onClose, ...props }: ModalProps) {
  const insets = useSafeAreaInsets()

  return (
    <RNModal
      transparent
      visible={open}
      // TODO: Probably calling onClose twice
      onRequestClose={onClose}
      onDismiss={onClose}
      animationType="fade"
      {...props}
    >
      <Backdrop onPress={onClose} />
      <View
        pointerEvents="box-none"
        style={[{ flex: 1, marginTop: insets.top, marginBottom: insets.bottom }, containerStyle]}
      >
        {children}
      </View>
    </RNModal>
  )
}
