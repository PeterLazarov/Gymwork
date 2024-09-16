import { Text } from 'react-native'
import { Portal, Dialog } from 'react-native-paper'

import { Button, ButtonText, fontSize, useColors } from 'designSystem'
import { translate } from 'app/i18n'

type Props = {
  open: boolean
  message: string
  onConfirm: () => void
  onClose: () => void
  cancelButtonText?: string
  confirmButtonText?: string
}
const ConfirmationDialog: React.FC<Props> = ({
  open,
  message,
  onConfirm,
  onClose,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
}) => {
  const colors = useColors()

  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={onClose}
      >
        <Dialog.Title>{translate('warning')}</Dialog.Title>
        <Dialog.Content>
          <Text style={{ fontSize: fontSize.md, color: colors.neutralText }}>
            {message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onClose}
          >
            <ButtonText variant="tertiary">{cancelButtonText}</ButtonText>
          </Button>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onConfirm}
          >
            <ButtonText variant="tertiary"> {confirmButtonText}</ButtonText>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default ConfirmationDialog
