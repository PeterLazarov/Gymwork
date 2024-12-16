import { translate } from 'app/i18n'
import { ConfirmationDialog, Snackbar } from 'designSystem'
import { ReactNode, useContext, useState, createContext } from 'react'

type SnackbarOptions = {
  text: string
  actionText?: string
  action?: () => void
}
type ConfirmationOptions = {
  message: string
  onConfirm: () => void
  onClose: () => void
}
type DialogContextType = {
  snackbarOptions?: SnackbarOptions
  showSnackbar?: (options?: SnackbarOptions) => void
  confirmationOptions?: ConfirmationOptions
  showConfirm?: (options?: ConfirmationOptions) => void
}
const DialogContext = createContext<DialogContextType>({})

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useDialogContext = () => useContext(DialogContext)

type Props = {
  children: ReactNode
}
export const DialogContextProvider: React.FC<Props> = ({ children }) => {
  const [snackbarOptions, setSnackbarOptions] = useState<
    SnackbarOptions | undefined
  >()
  const [confirmationOptions, setConfirmationOption] = useState<
    ConfirmationOptions | undefined
  >()
  return (
    <DialogContext.Provider
      value={{
        snackbarOptions,
        showSnackbar: setSnackbarOptions,
        confirmationOptions,
        showConfirm: setConfirmationOption,
      }}
    >
      {children}
      {snackbarOptions && (
        <Snackbar
          visible={!!snackbarOptions}
          onDismiss={() => setSnackbarOptions(undefined)}
          text={snackbarOptions.text}
          action={
            snackbarOptions.action
              ? {
                  label: snackbarOptions.actionText!,
                  onPress: snackbarOptions.action,
                }
              : undefined
          }
        />
      )}
      {confirmationOptions && (
        <ConfirmationDialog
          open={!!confirmationOptions}
          message={confirmationOptions.message}
          onClose={confirmationOptions.onClose}
          onConfirm={confirmationOptions.onConfirm}
          cancelButtonText={translate('cancel')}
          confirmButtonText={translate('confirm')}
        />
      )}
    </DialogContext.Provider>
  )
}
