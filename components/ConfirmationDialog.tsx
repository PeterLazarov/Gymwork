import { Portal, Dialog, Text, Button } from 'react-native-paper'

import colors from '../designSystem/colors'

type Props = {
  open: boolean
  message: string
  onConfirm: () => void
  onClose: () => void
}
const ConfirmationDialog: React.FC<Props> = ({
  open,
  message,
  onConfirm,
  onClose,
}) => {
  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={onClose}
      >
        <Dialog.Title>Warning</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={{ flex: 1 }}
            textColor={colors.tertiaryText}
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            style={{ flex: 1 }}
            textColor={colors.tertiaryText}
            onPress={onConfirm}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default ConfirmationDialog
