import { TextInput } from 'react-native'

export default function manageInputFocus(
  inputRefs: Array<React.RefObject<TextInput>>,
  handleSubmit: (ref: React.RefObject<TextInput>) => void
) {
  function isLastInput(currInputRef: React.RefObject<TextInput>) {
    return currInputRef === inputRefs.at(-1)
  }

  function onHandleSubmit(currInputRef: React.RefObject<TextInput>) {
    if (isLastInput(currInputRef)) {
      handleSubmit(currInputRef)
    } else {
      const nextInput = inputRefs[inputRefs.indexOf(currInputRef) + 1]
      nextInput.current?.focus()
    }
  }

  return { onHandleSubmit, isLastInput }
}
