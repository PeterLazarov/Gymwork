import { Modal, View } from "react-native"
import { Portal } from "react-native-paper"

import { translate } from "@/utils"
import { fontSize, spacing, useColors } from "../tokens"
import { Backdrop } from "./Backdrop"
import { Button } from "./Button"
import { Divider } from "./Divider"
import { Text } from "./Text"

type Props = {
  open: boolean
  message: string
  onConfirm: () => void
  onClose: () => void
  cancelButtonText?: string
  confirmButtonText?: string
}
export const ConfirmationDialog: React.FC<Props> = ({
  open,
  message,
  onConfirm,
  onClose,
  cancelButtonText = "Cancel",
  confirmButtonText = "Confirm",
}) => {
  const colors = useColors()

  return (
    <Portal>
      <Modal
        transparent
        visible={open}
        onRequestClose={onClose}
        animationType="fade"
      >
        <Backdrop onPress={onClose} />
        <View
          pointerEvents="box-none"
          style={{ justifyContent: "center", flex: 1 }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              marginHorizontal: spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: fontSize.lg,
                textAlign: "center",
                padding: spacing.md,
              }}
            >
              {translate("warning")}
            </Text>
            <Divider
              orientation="horizontal"
              variant="primary"
            />
            <View style={{ padding: spacing.md }}>
              <Text>{message}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Button
                variant="tertiary"
                style={{ flex: 1 }}
                onPress={onClose}
                text={cancelButtonText}
              />
              <Button
                variant="tertiary"
                style={{ flex: 1 }}
                onPress={onConfirm}
                text={confirmButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}
