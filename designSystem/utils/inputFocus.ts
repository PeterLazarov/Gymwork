import { TextInput } from 'react-native'

export function manageInputFocus(
  inputRefs: React.RefObject<TextInput>[],
  handleSubmit: (ref: React.RefObject<TextInput>) => void
) {
  function isLastInput(currInputRef: React.RefObject<TextInput>) {
    return currInputRef === inputRefs.filter(ref => !!ref.current).at(-1)
  }

  function onHandleSubmit(currInputRef: React.RefObject<TextInput>) {
    if (isLastInput(currInputRef)) {
      handleSubmit(currInputRef)
    } else {
      const nextInput = inputRefs[inputRefs.indexOf(currInputRef) + 1]
      nextInput?.current?.focus()
    }
  }

  return { onHandleSubmit, isLastInput }
}
