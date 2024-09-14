import { colorSchemas } from 'designSystem'

export const feelingOptions = {
  sad: {
    icon: 'emoji-sad',
    label: 'Bad',
    color: colorSchemas.coral.hue600,
    value: 'sad',
  },
  neutral: {
    icon: 'emoji-happy',
    label: 'Good',
    color: colorSchemas.amber.hue600,
    value: 'neutral',
  },
  happy: {
    icon: 'grin-stars',
    label: 'Great',
    color: colorSchemas.green.hue600,
    value: 'happy',
  },
}

export const painOptions = {
  pain: {
    icon: 'alert-decagram-outline',
    label: 'Pain',
    color: colorSchemas.coral.hue600,
    value: 'pain',
  },
  discomfort: {
    icon: 'warning-outline',
    label: 'Discomfort',
    color: colorSchemas.amber.hue600,
    value: 'discomfort',
  },
  noPain: {
    icon: 'check',
    label: 'No pain',
    color: colorSchemas.green.hue600,
    value: 'noPain',
  },
}
