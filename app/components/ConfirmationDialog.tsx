import { Portal, Dialog } from 'react-native-paper'

import { BodyLargeLabel, Button, ButtonText } from 'designSystem'
import { translate } from 'app/i18n'

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
        <Dialog.Title>{translate('warning')}</Dialog.Title>
        <Dialog.Content>
          <BodyLargeLabel>{message}</BodyLargeLabel>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onClose}
          >
            <ButtonText variant="tertiary">{translate('cancel')}</ButtonText>
          </Button>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onConfirm}
          >
            <ButtonText variant="tertiary"> {translate('confirm')}</ButtonText>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default ConfirmationDialog
