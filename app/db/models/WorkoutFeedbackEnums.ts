import { palettes } from 'designSystem'

export const feelingOptions = {
  sad: {
    icon: 'emoji-sad',
    label: 'Bad',
    color: palettes.coral.hue600,
    value: 'sad',
  },
  neutral: {
    icon: 'emoji-happy',
    label: 'Good',
    color: palettes.amber.hue600,
    value: 'neutral',
  },
  happy: {
    icon: 'grin-stars',
    label: 'Great',
    color: palettes.green['60'],
    value: 'happy',
  },
}

export const painOptions = {
  pain: {
    icon: 'alert-decagram-outline',
    label: 'Pain',
    color: palettes.coral.hue600,
    value: 'pain',
  },
  discomfort: {
    icon: 'warning-outline',
    label: 'Discomfort',
    color: palettes.amber.hue600,
    value: 'discomfort',
  },
  noPain: {
    icon: 'check',
    label: 'No pain',
    color: palettes.green['60'],
    value: 'noPain',
  },
}
