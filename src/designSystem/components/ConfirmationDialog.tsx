import { Portal, Dialog } from "react-native-paper"

import { Text } from "./Text"
import { Button } from "./Button"
import { translate } from "@/utils"

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
  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={onClose}
      >
        <Dialog.Title>{translate("warning")}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
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
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
