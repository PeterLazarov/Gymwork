import React from "react"
import { Modal as RNModal, ModalProps as RNModalProps, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Backdrop } from "./Backdrop"
import { Text } from "./Text"
import { Divider } from "./Divider"
import { fontSize, spacing } from "../tokens"

type ModalProps = Omit<RNModalProps, "visible"> & {
  containerStyle?: ViewStyle
  open: boolean
  onClose: () => void
}

export const Modal: React.FC<ModalProps> & {
  Header: React.FC<{ title: string }>
} = ({ containerStyle, open, children, onClose, ...props }) => {
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

type HeaderProps = {
  title: string
}

Modal.Header = ({ title }: HeaderProps) => {
  return  <>
    <Text
      style={{
        fontSize: fontSize.md,
        textAlign: "center",
        padding: spacing.sm,
      }}
    >
      {title}
    </Text>
    <View style={{ paddingHorizontal: spacing.sm }}>
      <Divider
        orientation="horizontal"
        variant="primary"
      />
    </View>
  </>
} 