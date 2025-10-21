import React from "react"
import {
  Portal,
  Snackbar as SnackbarPaper,
  SnackbarProps as SnackbarPropsPaper,
} from "react-native-paper"

export type SnackbarProps = Omit<SnackbarPropsPaper, "children"> & {
  text: string
}

export const Snackbar: React.FC<SnackbarProps> = ({ text, ...otherProps }) => {
  return (
    <Portal>
      <SnackbarPaper {...otherProps}>{text}</SnackbarPaper>
    </Portal>
  )
}
