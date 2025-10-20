import { TextInput } from 'react-native'

export function manageInputFocus(
  inputRefs: React.RefObject<TextInput | null>[],
  handleSubmit: (ref: React.RefObject<TextInput | null>) => void
) {
  function isLastInput(currInputRef: React.RefObject<TextInput | null>) {
    return currInputRef === inputRefs.filter(ref => !!ref.current).at(-1)
  }

  function onHandleSubmit(currInputRef: React.RefObject<TextInput | null>) {
    if (isLastInput(currInputRef)) {
      handleSubmit(currInputRef)
    } else {
      const nextInput = inputRefs[inputRefs.indexOf(currInputRef) + 1]
      nextInput?.current?.focus()
    }
  }

  return { onHandleSubmit, isLastInput }
}
