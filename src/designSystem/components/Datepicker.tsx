import { useCallback, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates"
import { SingleChange } from "react-native-paper-dates/src/Date/Calendar"

import { enGB, registerTranslation } from "react-native-paper-dates"
registerTranslation("en-GB", enGB)

type Props = {
  value?: string
  label: string
  onChange: (value: string) => void
}

const Datepicker: React.FC<Props> = ({ value, label, onChange }) => {
  const [open, setOpen] = useState(false)
  const onDismissSingle = useCallback(() => {
    setOpen(false)
  }, [setOpen])
  const valueDate = value ? new Date(value) : undefined

  const onConfirmSingle = useCallback<SingleChange>(
    ({ date }) => {
      setOpen(false)
      onChange(date?.toISOString() || "")
    },
    [setOpen, onChange],
  )

  return (
    <View style={{ height: 55 }}>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <DatePickerInput
          locale="en-GB"
          label={label}
          value={valueDate}
          onChange={(d) => onChange(d?.toISOString() || "")}
          disabled
          inputMode="start"
          style={{ marginTop: 54 }}
        />
      </TouchableOpacity>
      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={open}
        label={label}
        onDismiss={onDismissSingle}
        date={value ? valueDate : new Date()}
        onConfirm={onConfirmSingle}
      />
    </View>
  )
}

export default Datepicker
