import { TimerPicker } from 'react-native-timer-picker'

type Props = {
  valueSeconds: number
  onUpdate: (seconds: number) => void
}

const DurationPicker: React.FC<Props> = ({ valueSeconds, onUpdate }) => {
  function onChange(durationObject: {
    hours: number
    minutes: number
    seconds: number
  }) {
    const totalSeconds =
      durationObject.hours * 3600 +
      durationObject.minutes * 60 +
      durationObject.seconds

    onUpdate(totalSeconds)
  }

  const minutes = Math.floor((valueSeconds % 3600) / 60)
  const seconds = valueSeconds % 60

  return (
    <TimerPicker
      initialMinutes={minutes}
      initialSeconds={seconds}
      hideHours
      onDurationChange={onChange}
      styles={{
        theme: 'light',
        backgroundColor: 'transparent',
        pickerItem: {
          fontSize: 34,
        },
        pickerLabel: {
          fontSize: 26,
          right: -20,
        },
        pickerLabelContainer: {
          width: 60,
        },
        pickerItemContainer: {
          width: 160,
        },
      }}
    />
  )
}

export default DurationPicker
